"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Star,
  MapPin,
  Calendar,
  Check,
  MessageSquare,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FeedbackCard({ tour, userId }) {
  // Format date for display
  const formattedDate = new Date(tour.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
      <div className="p-5">
        <div className="flex flex-col sm:flex-row gap-5">
          {/* Left side - Tour image */}
          <div className="sm:w-1/3">
            <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
              <Image
                src={
                  tour?.tourId?.galleryImages?.[0] ||
                  "/placeholder.svg?height=300&width=300"
                }
                alt={tour.tourId?.tour_name || "Tour Image"}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <div className="flex items-center text-white text-xs">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span className="truncate max-w-[100px]">
                    {tour.tourId?.start_location?.name || "Location"}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-semibold">
                    {tour.averageRating || "4.5"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">
                {tour.name}
              </h3>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Right side - Feedback content */}
          <div className="sm:w-2/3 flex flex-col">
            {tour.rating ? (
              <>
                {/* Feedback header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Quote className="w-5 h-5 text-primary/60 mr-2" />
                    <h2 className="text-lg font-bold text-gray-800">
                      Your Feedback
                    </h2>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(tour.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Feedback content */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4 flex-grow">
                  <p className="text-gray-600 text-sm italic">
                    "
                    {tour.review ||
                      tour.text ||
                      "Great experience! The tour was well organized and the guide was very knowledgeable."}
                    "
                  </p>
                  <p className="text-gray-600 text-sm italic">
                    "
                    {tour.text ||
                      "Great experience! The tour was well organized and the guide was very knowledgeable."}
                    "
                  </p>
                </div>

                {/* Feedback confirmation */}
                <div className="bg-green-50 p-3 rounded-xl border border-green-100 mt-auto">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-1.5 rounded-full mr-3">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Thank you for your feedback!
                      </p>
                      <p className="text-xs text-gray-500">
                        Your rating helps improve our services
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* No feedback yet */}
                <div className="flex items-center mb-3">
                  <Quote className="w-5 h-5 text-gray-400 mr-2" />
                  <h2 className="text-lg font-bold text-gray-800">
                    Share Your Experience
                  </h2>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-4 flex-grow">
                  <p className="text-gray-500 text-sm">
                    We'd love to hear about your experience on this tour. Your
                    feedback helps us improve and assists other travelers in
                    making decisions.
                  </p>
                </div>

                <Link
                  href={`/${userId}/tour-detail/${tour.tourId?._id}/feedback`}
                >
                  <Button className="w-full flex items-center justify-center gap-2 mt-auto">
                    <MessageSquare className="w-4 h-4" />
                    Leave Feedback
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
