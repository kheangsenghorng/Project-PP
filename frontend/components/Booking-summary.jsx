"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { useTourStore } from "@/store/tourStore";
import { useEffect, useState } from "react";

export function BookingSummary() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const tourId = searchParams.get("tourId");
  const sit = searchParams.get("sit");
  const total = searchParams.get("total");

  const {
    tour,
    loading: tourLoading,
    error: tourError,
    fetchTour,
  } = useTourStore();

  useEffect(() => {
    if (tourId) fetchTour(tourId);
  }, [tourId]);

  const [monthYear, setMonthYear] = useState("");
  const [dayStart, setDayStart] = useState("");

  useEffect(() => {
    const date = new Date();
    setMonthYear(
      date.toLocaleString("en-US", { month: "long", year: "numeric" }) // Client-only
    );
    setDayStart(date.getDate());
  }, []);

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="mb-4">
          <Image
            src={tour?.galleryImages[0] || "/logo-edit.png"}
            alt="Phnom Penh Tour"
            width={350}
            height={200}
            className="rounded-md w-full object-cover"
          />
        </div>
        <h3 className="text-xl font-bold mb-4">{tour?.tour_name}</h3>

        <div className="space-y-2 mb-4">
          <div className="text-sm">sit {sit}</div>
          <div className="text-sm">
            {monthYear && (
              <div className="text-sm">
                Date {dayStart} {monthYear}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 border-t pt-4">
          <div className="flex justify-between">
            <span>Guest x {sit}</span>
            <span className="font-medium">{total}</span>
          </div>
        </div>

        <div className="flex justify-between border-t mt-4 pt-4">
          <span className="font-bold">Total</span>
          <span className="font-bold">{total}</span>
        </div>
      </CardContent>
    </Card>
  );
}
