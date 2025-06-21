"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock, MapPin, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TourItinerary from "@/components/Touritinerary";
import { useParams } from "next/navigation";
import { useBookingStore } from "../../../../../store/useBookingStore";
import { useTourStore } from "@/store/tourStore";

export default function TourDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const tourId = Array.isArray(params?.tourId)
    ? params.tourId[0]
    : params?.tourId;

  const {
    fetchTourBookingsUser,
    totalSit,
    totalPrice,
    fetchBookingsByUserId,
    fetchBookingsByUser,
  } = useBookingStore();

  const { fetchTour, tour } = useTourStore();

  useEffect(() => {
    if (tourId && id) {
      fetchTourBookingsUser(tourId, id);
      fetchTour(tourId);
    }
  }, [tourId, id, fetchTourBookingsUser, fetchTour]);

  const parseDate = (dateStr) => (dateStr ? new Date(dateStr) : null);

  const startDate = parseDate(tour?.startDate);
  const endDate = parseDate(tour?.endDate);

  const formatDateRange = (start, end) => {
    if (!start || !end) return "N/A";
    const options = { month: "long", day: "numeric", year: "numeric" };
    return `${start.toLocaleDateString(
      "en-US",
      options
    )} - ${end.toLocaleDateString("en-US", options)}`;
  };

  const getTourDuration = (start, end) => {
    if (!start || !end) return "N/A";
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  const getDaysUntilStart = (start) => {
    if (!start) return "N/A";
    const today = new Date();
    const diffTime = start.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntil = getDaysUntilStart(startDate);
  const badgeText =
    daysUntil <= 0
      ? `Today In ${daysUntil} days`
      : daysUntil === 1
      ? "Tomorrow"
      : `In ${daysUntil} days`;

  // console.log(tour);

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/profile/${id}/notication`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{tour?.tour_name}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="relative rounded-lg overflow-hidden">
            <img
              src={tour?.galleryImages?.[0] || "/image/1.jpg"}
              alt={tour?.tour_name || "Tour"}
              className="w-full h-[300px] object-cover"
            />
            <Badge
              className="absolute right-4 top-4"
              variant={daysUntil <= 1 ? "destructive" : "secondary"}
            >
              {badgeText}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <InfoCard
              icon={<CalendarDays />}
              label="Start Date"
              value={startDate?.toLocaleDateString() || "N/A"}
            />
            <InfoCard
              icon={<Clock />}
              label="Duration"
              value={getTourDuration(startDate, endDate)}
            />
            <InfoCard
              icon={<MapPin />}
              label="Location"
              value={tour?.start_location?.name || "N/A"}
            />
            <InfoCard
              icon={<Users />}
              label="Guests"
              value={`${totalSit || 0} people`}
            />
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              {/* <TabsTrigger value="details">Details</TabsTrigger> */}
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tour Overview</CardTitle>
                  <CardDescription>
                    {formatDateRange(startDate, endDate)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>{tour?.description || "No description available."}</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* <FeatureList
                      title="What's Included"
                      items={tour?.includes || []}
                      color="primary"
                    />
                    <FeatureList
                      title="What's Not Included"
                      items={tour?.excludes || []}
                      color="destructive"
                    /> */}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="itinerary" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tour Itinerary</CardTitle>
                  <CardDescription>
                    Day-by-day schedule for your{" "}
                    {getTourDuration(startDate, endDate)} tour
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div>Loading itinerary...</div>}>
                    <TourItinerary tourId={tour?.tourId || tourId} />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                  <CardDescription>
                    Important information about your booking
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <DetailItem
                      label="Booking Reference"
                      value={`TOUR-${
                        tour?.tour_id
                      }-${new Date().getFullYear()}`}
                    />
                    <DetailItem
                      label="Payment Status"
                      value={<Badge variant="outline">Paid in Full</Badge>}
                    />
                    <DetailItem
                      label="Meeting Point"
                      value="Central Station, 8:00 AM"
                    />
                    <DetailItem
                      label="Tour Guide"
                      value="John Smith (Contact: +1234567890)"
                    />
                  </div>
                  <div className="rounded-md bg-muted p-4">
                    <h4 className="mb-2 font-medium">Important Notes</h4>
                    <ul className="space-y-2 text-sm list-disc pl-5">
                      <li>Please arrive 15 minutes early.</li>
                      <li>Bring walking shoes and appropriate clothing.</li>
                      <li>Bring your camera, water bottle, and meds.</li>
                      <li>Emergency contact: +1234567890</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <BookingSummary
            tour={tour}
            totalSit={totalSit}
            totalPrice={totalPrice}
          />
          {/* <SupportCard /> */}
        </div>
      </div>
    </div>
  );
}

// Helper components
function InfoCard({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border p-4 text-center">
      <div className="mb-2 h-6 w-6 text-primary">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
      <span className="text-xs text-muted-foreground">{value}</span>
    </div>
  );
}

function FeatureList({ title, items, color }) {
  return (
    <div>
      <h4 className="mb-2 font-medium">{title}</h4>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <span className={`h-1.5 w-1.5 rounded-full bg-${color}`}></span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="space-y-1">
      <h4 className="text-sm font-medium">{label}</h4>
      <p className="text-sm text-muted-foreground">{value}</p>
    </div>
  );
}

function BookingSummary({ tour, totalSit, totalPrice }) {
  console.log(tour);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
        <CardDescription>Your tour package details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="font-medium">Tour Package</span>
          <span>${tour?.price}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Guests</span>
          <span>
            {totalSit} × ${tour?.price}
          </span>
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SupportCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Need Help?</CardTitle>
        <CardDescription>Contact our support team</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full">Contact Support</Button>
        <Button variant="outline" className="w-full">
          Download Itinerary
        </Button>
        <Button variant="outline" className="w-full">
          Cancel Booking
        </Button>
      </CardContent>
    </Card>
  );
}
