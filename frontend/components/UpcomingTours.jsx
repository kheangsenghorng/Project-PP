"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { useBookingStore } from "../store/useBookingStore";

export default function UpcomingTours() {
  const { id } = useParams();

  const {
    bookings,
    fetchBookingsByUserId,
    fetchBookingsByUser,
    loading,
    error,
  } = useBookingStore();

  useEffect(() => {
    if (id) {
      fetchBookingsByUserId(id);
      fetchBookingsByUser(id);
    }
  }, [id, fetchBookingsByUserId, fetchBookingsByUser]);

  const formatDateRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const options = { month: "short", day: "numeric" };
    return `${startDate.toLocaleDateString(
      "en-US",
      options
    )} - ${endDate.toLocaleDateString("en-US", options)}`;
  };

  const getDaysUntilStart = (start) => {
    const today = new Date();
    const startDate = new Date(start);
    const diffTime = startDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getTourDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate.getTime() - startDate.getTime();
    return `${Math.ceil(diffTime / (1000 * 60 * 60 * 24))} days`;
  };

  // Filter only future or ongoing tours
  const upcomingBookings = bookings.filter((tour) => {
    const endDate = new Date(tour.tourId?.endDate);
    const today = new Date();
    endDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return endDate >= today;
  });

  if (loading) {
    return (
      <div className="text-center text-muted-foreground">
        No upcoming booked tours.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {upcomingBookings.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No upcoming booked tours.
        </p>
      ) : (
        upcomingBookings.map((tour, index) => {
          const startDate = tour.tourId?.startDate;
          const endDate = tour.tourId?.endDate;
          const image = tour.galleryImages?.[0] || "/placeholder.svg";
          const daysUntilStart = getDaysUntilStart(startDate);

          return (
            <Card key={index} className="overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="relative">
                  <img
                    src={image}
                    alt={tour.tourId?.tour_name || "Tour Booking"}
                    className="h-full w-full object-cover"
                  />
                  <Badge
                    className="absolute right-2 top-2"
                    variant={daysUntilStart <= 1 ? "destructive" : "secondary"}
                  >
                    {daysUntilStart <= 0
                      ? `Today `
                      : daysUntilStart === 1
                      ? "Tomorrow"
                      : `In ${daysUntilStart} days`}
                  </Badge>
                </div>
                <div className="col-span-2 p-4">
                  <h3 className="text-xl font-semibold">
                    {tour.tourId?.tour_name}
                  </h3>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDateRange(startDate, endDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{getTourDuration(startDate, endDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{tour.tourId.start_location?.name}</span>
                      <span>{tour.tourId.first_destination?.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {tour.totalSit}{" "}
                        {tour.totalSit === 1 ? "guest" : "guests"}
                      </span>
                    </div>
                  </div>
                  <CardFooter className="mt-4 justify-end p-0">
                    <Button asChild size="sm">
                      <Link
                        href={`/profile/${id}/tourDetails/${tour.tourId?._id}`}
                      >
                        View Details
                      </Link>
                    </Button>
                  </CardFooter>
                </div>
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
}
