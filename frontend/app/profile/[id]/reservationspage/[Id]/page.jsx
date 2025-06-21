"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReservationCard from "../../../../../components/ReservationCard";
import TabButton from "../../../../../components/TabButton";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ReservationsPage() {
  const { id, reservationId } = useParams(); // Ensure correct param names
  const [activeTab, setActiveTab] = useState("hotel");
  const [currentPage, setCurrentPage] = useState(1);

  const reservations = [
    {
      id: 1,
      hotelName: "Gold Royal Hotel",
      bookingDate: "19 Nov 2024",
      duration: "2 days 3 night",
      price: 350,
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 2,
      hotelName: "Gold Royal Hotel",
      bookingDate: "19 Nov 2024",
      duration: "2 days 3 night",
      price: 350,
      image: "/placeholder.svg?height=400&width=600",
    },
  ];

  // Filter reservations by `reservationId` if it's provided
  const filteredReservations = useMemo(() => {
    if (reservationId && !isNaN(Number(reservationId))) {
      return reservations.filter((res) => res.id === Number(reservationId));
    }
    return reservations;
  }, [reservationId]);

  return (
    <div className="px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href={`/profile/${id}/notifications`}>
          <button className="mr-4">
            <ChevronLeft size={24} />
          </button>
        </Link>
        <h1 className="text-2xl font-bold">Reservations</h1>
      </div>

      <div className="flex space-x-2 mb-6">
        <TabButton
          label="Hotel"
          icon="building"
          active={activeTab === "hotel"}
          onClick={() => setActiveTab("hotel")}
        />
        <TabButton
          label="Tour"
          icon="users"
          active={activeTab === "tour"}
          onClick={() => setActiveTab("tour")}
        />
      </div>

      <h2 className="text-lg font-medium mb-4">Upcoming</h2>
      <div className="border-t border-gray-200 mb-6"></div>

      <div className="space-y-4">
        {filteredReservations.length > 0 ? (
          filteredReservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              hotelName={reservation.hotelName}
              bookingDate={reservation.bookingDate}
              duration={reservation.duration}
              price={reservation.price}
              image={reservation.image}
            />
          ))
        ) : (
          <p className="text-gray-500">No reservations found.</p>
        )}
      </div>

      <div className="flex justify-between items-center mt-8">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <ChevronLeft size={20} />
        </button>

        <div className="flex space-x-2">
          <button className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            1
          </button>
          <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
            2
          </button>
        </div>

        <button className="p-2 rounded-full hover:bg-gray-100">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
