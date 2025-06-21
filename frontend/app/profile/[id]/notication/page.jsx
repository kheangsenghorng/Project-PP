"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { useBookingStore } from "@/store/useBookingStore";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TourNotifications from "@/components/Notifcatiom";
import UpcomingTours from "@/components/UpcomingTours";
import { useParams } from "next/navigation";

export default function Home() {
  const { id, tourID } = useParams();

  // console.log(id);

  return (
    <div className="container mx-auto py-10">
      <div className="mb-10 space-y-2">
        <p className="text-muted-foreground">
          Manage your bookings and receive notifications for upcoming tours.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* <Card>
          <CardHeader className="pb-2">
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Your upcoming tour alerts and reminders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading notifications...</div>}>
              <TourNotifications />
            </Suspense>
          </CardContent>
        </Card> */}

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle> Hostory Booking Tour</CardTitle>
            <CardDescription>
              Tours you've booked that are coming up soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading tours...</div>}>
              <UpcomingTours />
            </Suspense>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/bookings">View All Bookings</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* <Card>
          <CardHeader className="pb-2">
            <CardTitle>Featured Tour</CardTitle>
            <CardDescription>Special offer for this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <img
                src="/placeholder.svg?height=200&width=400"
                alt="Beach resort tour"
                className="h-48 w-full rounded-md object-cover"
              />
              <h3 className="text-lg font-semibold">
                Tropical Paradise Getaway
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>5 days</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Up to 8 guests</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Bali, Indonesia</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>All-inclusive</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href={`/profile/${id}/tourDetails/${tourID}`}>
                Book Now
              </Link>
            </Button>
          </CardFooter>
        </Card> */}
      </div>
    </div>
  );
}
