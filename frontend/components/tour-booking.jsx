"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Star, MapPin, Clock, Bus, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import TourItinerary from "@/components/touritinerares";
import ReviewCardAttachment from "./review-card-attachment";
import { useParams } from "next/navigation";
import { useTourStore } from "@/store/tourStore";
import { useReviewStore } from "../store/reviewStore";
import { useRouter } from "next/navigation";

// TourBooking Component
export default function TourBooking() {
  const { id, tourId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { gallery, loading, error, fetchGallery, fetchTour, tour } =
    useTourStore();
  const {
    fetchReviews,
    lengthuserRating,
    averageRating,
    isLoading,
    error: errorRevies,
  } = useReviewStore();

  useEffect(() => {
    if (tourId) {
      fetchGallery(tourId);
      fetchTour(tourId);
      fetchReviews(id, tourId);
    }
  }, [id, tourId, fetchGallery, fetchTour, fetchReviews]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const getDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const router = useRouter();

  // if (loading) {
  //   return (
  //     <div className="text-center p-6">
  //       <p className="mb-4">Loading...</p>
  //       <button
  //         onClick={() => router.back()}
  //         className="text-blue-600 hover:underline flex items-center justify-center"
  //       >
  //         ← Go Back
  //       </button>
  //     </div>
  //   );
  // }

  if (error || errorRevies) {
    return (
      <div className="text-center p-6">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:underline flex items-center justify-center"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="text-center p-6 text-gray-500">
        <p className="mb-4">No tour found.</p>
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:underline flex items-center justify-center"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  if (!gallery || !gallery.length === 0) {
    return (
      <div className="text-center p-6 text-gray-500">
        <p className="mb-4">No images available for this tour.</p>
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:underline flex items-center justify-center"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-full mx-auto p-4 rounded-lg">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-2 md:col-span-2 shadow-sm bg-white rounded-lg p-4">
          {/* Gallery Section */}
          <div className="grid md:grid-cols-12 gap-2 mb-6">
            <div className="col-span-12 md:col-span-7 relative rounded-lg overflow-hidden h-[300px]">
              {gallery && gallery.length > 0 ? (
                <img
                  src={gallery[0] || "/placeholder.svg"}
                  alt={tour?.tour_name || "Tour Image"}
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                  <p className="text-center text-gray-500">
                    No images available
                  </p>
                </div>
              )}
            </div>
            <div className="col-span-12 md:col-span-5 grid grid-cols-2 gap-2">
              {gallery &&
                gallery.slice(1, 4).map((image, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden h-[150px]"
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Tour Image ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg shadow-sm"
                    />
                  </div>
                ))}
              {gallery && gallery.length > 4 && (
                <div className="relative rounded-lg overflow-hidden h-[150px]">
                  <img
                    src={gallery[4] || "/placeholder.svg"}
                    alt="Photo 4"
                    className="w-full h-full object-cover rounded-lg shadow-md"
                  />
                  <button
                    onClick={handleOpenModal}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-lg font-semibold rounded-lg"
                  >
                    <Plus className="mr-1" size={18} />
                    {gallery.length - 4} More
                  </button>
                </div>
              )}
            </div>
            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-4 w-[80%] max-w-2xl">
                  <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {gallery &&
                      gallery
                        .slice(5)
                        .map((image, index) => (
                          <img
                            key={index}
                            src={image || "/placeholder.svg"}
                            alt={`Photo ${index + 5}`}
                            className="w-full h-48 object-cover rounded-lg shadow-md"
                          />
                        ))}
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tour Info Section */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {tour?.tour_name || "Tour Name"}
              </h1>
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={18} className="text-gray-500" />
                <span className="text-gray-600">
                  {tour.start_location?.name || "N/A"}
                  {tour.first_destination?.name &&
                    ` → ${tour.first_destination.name}`}
                  {tour.second_destination?.name &&
                    ` → ${tour.second_destination.name}`}
                </span>
                <span className="mx-1 text-gray-400">|</span>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={`${
                        star <= averageRating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-gray-600">
                    {Number(averageRating.toFixed(1))}
                  </span>
                  <span className="ml-1 text-gray-600">
                    ({lengthuserRating} reviews)
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-1">
                  <Clock size={18} className="text-gray-500" />
                  <span className="text-gray-700">
                    {getDuration(tour?.startDate, tour?.endDate)} Days
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Bus size={18} className="text-gray-500" />
                  <span className="text-gray-700">Transport</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={18} className="text-gray-500" />
                  <span className="text-gray-700">Family Plan</span>
                </div>
              </div>
              <div className="mt-3">
                <Badge variant="outline" className="text-gray-600">
                  {tour?.startDate && tour?.endDate
                    ? `${new Date(
                        tour.startDate
                      ).toLocaleDateString()} - ${new Date(
                        tour.endDate
                      ).toLocaleDateString()}`
                    : "Dates not available"}
                </Badge>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="text-3xl font-bold text-gray-800">
                ${tour?.price || "N/A"}{" "}
                <span className="text-base font-normal text-gray-600">
                  /person
                </span>
              </div>
            </div>
          </div>
        </div>
        <Tabs defaultValue="phnom-penh" className="mb-8 md:col-span-1">
          <TabsContent value="phnom-penh">
            {/* Room Options */}
            <TourItinerary tourId={tourId} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Reviews Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Ratings and Reviews
          </h2>
          <Button
            variant="outline"
            size="sm"
            className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
          >
            View All
          </Button>
        </div>

        <div className="">
          <ReviewCardAttachment id={id} tourId={tourId} />
        </div>
      </div>
    </div>
  );
}
