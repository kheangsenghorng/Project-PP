"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Star,
  MapPin,
  Calendar,
  Clock,
  MessageCircle,
  Users,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePastToursStore } from "@/store/usePastToursStore";
import { useEffect } from "react";

export default function TourCard({ userId }) {
  const {
    tours,
    loading: toursLoading,
    error: toursError,
    fetchPastTours,
  } = usePastToursStore();

  useEffect(() => {
    if (userId) {
      fetchPastTours(userId);
    }
  }, [userId, fetchPastTours]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (toursLoading) return <p>Loading...</p>;
  if (toursError) return <p>Error loading tours.</p>;

  return (
    <>
      {tours?.map((tour, index) => {
        const formattedDate = new Date(tour.createdAt).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            year: "numeric",
          }
        );

        return (
          <div
            key={index}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 mb-6"
          >
            <div className="relative">
              <div className="h-48 relative">
                <Image
                  src={
                    tour?.galleryImages?.[0] ||
                    "/placeholder.svg?height=300&width=300"
                  }
                  alt={tour?.tour_name || "Tour Image"}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>

              <div className="absolute top-4 left-4">
                <Badge
                  className={`${getStatusColor(
                    tour?.status
                  )} px-2.5 py-1 font-medium text-xs`}
                >
                  {tour?.status || "Tour"}
                </Badge>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h2 className="text-xl font-bold text-white mb-1 line-clamp-2">
                  {tour.tour_name}
                </h2>
                <div className="flex items-center text-white/80 text-sm">
                  <MapPin className="w-3.5 h-3.5 mr-1.5" />
                  <span className="line-clamp-1">
                    {tour?.start_location?.name || "Location"}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{formattedDate}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" />
                  <span className="truncate">
                    {new Date(tour.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" />
                  <span className="truncate">
                    {tour.participants || "2-10"} people
                  </span>
                </div>

                {/* <div className="flex items-center text-sm text-gray-600">
                  <MessageCircle className="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" />
                  <span className="truncate">
                    {tour.totalReviews || "0"} reviews
                  </span>
                </div> */}
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {tour?.description ||
                  tour?.text ||
                  "Experience this amazing tour with our expert guides."}
              </p>

              <Link href={`/profile/${userId}/feedbackpage/${tour.tourId}`}>
                <Button className="w-full group">
                  View Details
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        );
      })}
    </>
  );
}
