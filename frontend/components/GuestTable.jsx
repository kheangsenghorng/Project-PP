"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { BookingDetailCard } from "@/components/booking-detail-card";
import { useBookingStore } from "@/store/useBookingStore";
import { useParams, useRouter } from "next/navigation";

// import { Calendar } from "@/components/ui/calendar";

import {
  ChevronRight,
  X,
  Calendar,
  Users,
  CreditCard,
  Clock,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

export default function GuestTable() {
  const params = useParams();
  const tourId = params?.bookingtourId;
  const id = params?.id;
  const router = useRouter();
  const {
    bookings,
    groupedBookings,
    totalSeats,
    totalBookings,
    totalUniqueUsers,
    loading,
    error,
    fetchTourBookings,
  } = useBookingStore();

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailCard, setShowDetailCard] = useState(false);

  useEffect(() => {
    if (tourId) {
      fetchTourBookings(id, tourId);
    }
  }, [id, tourId, fetchTourBookings]);

  function formatBookingDate(dateString) {
    const date = new Date(dateString);
    const options = { month: "short", year: "numeric" };
    const day = date.getDate();

    const getDaySuffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    const formattedDate = `${
      date.toLocaleString("en-US", options).split(" ")[0]
    } ${day}${getDaySuffix(day)}, ${date.getFullYear()}`;
    return formattedDate;
  }

  function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  const handleViewDetails = (userId) => {
    router.push(`/admin/${id}/addpackage/bookingtour/${tourId}/${userId}`);
  };

  const closeDetailCard = () => {
    setShowDetailCard(false);
    // Reset selected booking after animation completes
    setTimeout(() => {
      setSelectedBooking(null);
    }, 300);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 overflow-hidden relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Guest List</h3>
        <div className="flex items-center space-x-4">
          <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
            Total Bookings: {totalBookings || totalBookings.length}
          </div>
          <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
            Total user: {totalUniqueUsers || 0}
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
          <p className="ml-3 text-gray-600">Loading bookings...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="mb-3">
            <Users className="h-12 w-12 mx-auto text-gray-400" />
          </div>
          <p className="text-lg">No guests found for this tour.</p>
          <p className="text-sm mt-2">
            Bookings will appear here once guests make reservations.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-left">
                <th className="p-4 font-medium">ID</th>
                <th className="p-4 font-medium">Guest</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Booking</th>
                <th className="p-4 font-medium">No. Guests</th>
                <th className="p-4 font-medium text-right">Total</th>
                <th className="p-4 font-medium text-center">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {groupedBookings.map((booking, index) => (
                <tr
                  key={booking._id || index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 text-gray-500">#{index + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage
                          src={
                            booking.userId?.profile_image ||
                            "/default-profile.png" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg"
                          }
                          alt={booking.userId?.name}
                        />
                        <AvatarFallback>
                          {booking.userId?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-800">
                          {booking.userId?.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{booking.userId?.email}</td>
                  <td className="p-4 text-gray-600">{booking.bookingCount}</td>
                  <td className="p-4 text-gray-600">{booking.totalSit}</td>
                  <td className="p-4 text-right font-medium">
                    ${booking.totalPrice?.toLocaleString() || 0}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleViewDetails(booking.userId?._id)}
                      className="p-2 rounded-full hover:bg-blue-50 text-blue-600 transition-colors"
                      aria-label="View booking details"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
        <div>
          Showing {groupedBookings.length} of{" "}
          {totalUniqueUsers || groupedBookings.length} guests
        </div>
        {/* Pagination Placeholder */}
        <div className="flex space-x-4">
          <button className="px-3 py-1 border rounded-md hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 border rounded-md bg-blue-600 text-white">
            1
          </button>
          <button className="px-3 py-1 border rounded-md hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
      {/* <BookingDetailCard
        selectedBooking={selectedBooking}
        bookings={bookings}
        showDetailCard={showDetailCard}
        closeDetailCard={closeDetailCard}
        handleViewDetails={handleViewDetails}
      /> */}
    </div>
  );
}
