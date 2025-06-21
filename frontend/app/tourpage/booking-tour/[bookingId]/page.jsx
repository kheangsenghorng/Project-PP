"use client";

import { useState } from "react";
import { BookingForm } from "@/components/Booking-form";
import { BookingSummary } from "@/components/Booking-summary";
import { useParams } from "next/navigation";

const Booking = () => {
  const { id, bookingId } = useParams();
  return (
    <div className="min-h-screen bg-white p-7">
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <BookingForm />
          </div>
          <div>
            <BookingSummary bookingId={bookingId} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Booking;
