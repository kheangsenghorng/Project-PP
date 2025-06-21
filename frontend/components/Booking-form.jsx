"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentOptions } from "./payment-options";
import { userStore } from "@/store/userStore";
import { useBookingStore } from "@/store/useBookingStore";
import axios from "axios"; // Import Axios for API calls

export function BookingForm() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const tourId = searchParams.get("tourId");
  const sit = searchParams.get("sit");
  const total = searchParams.get("total");
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showProfileLoading, setShowProfileLoading] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("card");

  // User store hooks
  const { user, loading, error, fetchUserById } = userStore();

  // Booking store hooks
  const {
    createBooking,
    loading: bookingLoading,
    error: bookingError,
    success,
    bookingData,
    resetStatus,
  } = useBookingStore();

  useEffect(() => {
    if (id) {
      setShowProfileLoading(true);
      fetchUserById(id).finally(() => {
        setTimeout(() => {
          setShowProfileLoading(false);
        }, 1000);
      });
    }
  }, [id, fetchUserById]);

  // Handle booking confirmation
  const handleConfirm = async () => {
    if (!id) {
      router.push("/login");
      return;
    }

    if (!userId || !tourId || !sit || !total) {
      alert("Missing booking information.");
      return;
    }

    setShowLoadingOverlay(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await axios.post(
        `${backendUrl}/booking/tour/${tourId}/user/${userId}`,
        {
          bookingSit: Number(sit),
          bookingTotal: Number(total),
        }
      );

      console.log("Booking success:", response.data);
      setShowLoadingOverlay(false);
      setShowSuccess(true);

      setTimeout(() => {
        router.push(`/profile/${id}/notication`);
      }, 3000); // 3-second wait before redirecting
    } catch (err) {
      console.error("Booking failed:", err);
      setShowLoadingOverlay(false);
      alert(
        "Booking failed: " + err?.response?.data?.message ||
          "Something went wrong."
      );
    }
  };

  // Conditional rendering based on loading, error, and user state
  if (loading) return <p>Loading user...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>No user found.</p>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Confirm Booking</h2>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">
            Your details: {user?.firstname || "N/A"}
            <span> {user?.lastname || "N/A"}</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name *</Label>
              <Input id="firstName" placeholder={user?.firstname || "N/A"} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name *</Label>
              <Input id="lastName" placeholder={user?.lastname || "N/A"} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" placeholder={user?.phonenumber || "N/A"} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder={user?.email || "N/A"}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Payment Information</h3>
        <PaymentOptions id={id} onSelect={setPaymentMethod} />

        {paymentMethod === "card" && (
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Credit Card Number *</Label>
              <Input id="cardNumber" placeholder="1234 1234 1234 1234" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expDate">Expiration Date *</Label>
                <Input id="expDate" placeholder="MM / YY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV/CVC *</Label>
                <Input id="cvv" placeholder="CVC" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select defaultValue="cambodia">
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cambodia">Cambodia</SelectItem>
                    <SelectItem value="thailand">Thailand</SelectItem>
                    <SelectItem value="vietnam">Vietnam</SelectItem>
                    <SelectItem value="laos">Laos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input id="zipCode" placeholder="90210" />
              </div>
            </div>
          </div>
        )}

        {/* Main loading spinner overlay */}
        {showLoadingOverlay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-white border-t-transparent shadow-lg"></div>
              <p className="mt-4 text-white font-medium">
                Processing payment...
              </p>
            </div>
          </div>
        )}

        {/* Success message overlay - Enhanced Version */}
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-md">
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-fade-in-up">
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <div className="bg-green-500 rounded-full p-3 shadow-lg animate-success-bounce">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-8 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Booking Successful!
                </h3>
                <p className="text-gray-600 mb-6">
                  Your tour has been booked successfully.
                </p>
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full animate-progress-bar"></div>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  Redirecting you to your bookings...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Profile loading overlay */}
        {showProfileLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-95">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-4 text-lg text-gray-700 font-medium">
                Loading ...
              </p>
            </div>
          </div>
        )}

        {/* Booking button */}
        <Button
          className="w-full mt-8 bg-green-600 hover:bg-green-700"
          onClick={handleConfirm}
          disabled={bookingLoading || showLoadingOverlay} // Disable button if booking is in progress
        >
          {bookingLoading || showLoadingOverlay
            ? "Processing..."
            : "Confirm & Proceed"}
        </Button>
      </div>

      {/* Error and Success Handling */}
      {bookingError && <div className="text-red-500">{bookingError}</div>}
    </div>
  );
}
