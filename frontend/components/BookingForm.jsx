"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useParams, useRouter } from "next/navigation";
import { useTourStore } from "@/store/tourStore";

const BookingForm = () => {
  const params = useParams();
  const tourId = params?.tourId;
  const userId = params?.id; // Assuming this is user's ID

  const [sit, setSit] = useState(1);
  const [isGuestsDropdownOpen, setIsGuestsDropdownOpen] = useState(false);

  const { tour, loading, error: tourError, fetchTour } = useTourStore();

  const router = useRouter();

  useEffect(() => {
    if (tourId) fetchTour(tourId);
  }, [tourId]);

  const handleBooking = () => {
    if (!userId) {
      router.push("/login"); // Redirect if no user ID
      return;
    }

    if (!tourId) return; // Only return if tourId is missing

    const queryParams = new URLSearchParams({
      userId,
      tourId,
      sit: sit.toString(),
      total: totalPayment.toString(),
    }).toString();

    router.push(`/tour/${userId}/bookings/?${queryParams}`);
  };

  const totalPayment = sit * (tour?.price || 0);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleBooking();
      }}
      className="p-6 bg-white rounded-lg shadow-lg max-w-md"
    >
      <h2 className="text-2xl font-bold mb-4">BOOK A TOUR</h2>
      <p className="text-gray-600 mb-6">
        You may fill the form below to reserve your tour
      </p>

      {/* Sit Dropdown */}
      <div className="mb-6 relative">
        <label className="block font-semibold mb-2">Sit*</label>
        <div
          className="border rounded-lg p-4 cursor-pointer flex justify-between items-center"
          onClick={() => setIsGuestsDropdownOpen(!isGuestsDropdownOpen)}
        >
          <span>{sit} Sit</span>
          <FontAwesomeIcon
            icon={isGuestsDropdownOpen ? faChevronUp : faChevronDown}
            className="w-5 h-5 text-gray-600"
          />
        </div>
        {isGuestsDropdownOpen && (
          <div className="absolute z-10 border rounded-lg p-4 bg-white w-full top-full mt-2 shadow-lg">
            <div className="flex justify-between items-center">
              <span>Guests</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSit(Math.max(1, sit - 1))}
                  className="w-8 h-8 flex items-center justify-center border rounded-lg"
                >
                  -
                </button>
                <span>{sit}</span>
                <button
                  type="button"
                  onClick={() => setSit(sit + 1)}
                  className="w-8 h-8 flex items-center justify-center border rounded-lg"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Table */}
      <div className="mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left pb-2">Type</th>
              <th className="text-right pb-2">Quantity</th>
              <th className="text-right pb-2">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">Guest</td>
              <td className="text-right py-2">{sit}</td>
              <td className="text-right py-2">${totalPayment}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center font-bold text-lg mb-4">
        <span>Total Payment</span>
        <span>${totalPayment}</span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
      >
        {loading ? "Processing..." : "Book Now"}
      </button>
    </form>
  );
};

export default BookingForm;
