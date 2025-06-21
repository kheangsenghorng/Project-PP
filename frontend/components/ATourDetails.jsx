"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  Tag,
  Clock,
  MapPin,
  CheckCircle,
  DollarSign,
  ImageIcon,
  ChevronRight,
} from "lucide-react";
import { useTourStore } from "@/store/tourStore";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { useBookingStore } from "@/store/useBookingStore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TourDetailsPage() {
  const { bookingtourId, id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const {
    accommodation,
    setAccommodation,
    updateAccommodationOnServer,
    fetchTour,
    tour,
    fetchGallery,
    gallery,
    totalSit,
    totalPrice,
  } = useTourStore();

  const accommodationLabels = [
    "AC",
    "Heating",
    "Dishwasher",
    "Pets Allowed",
    "Fitness Center",
    "Airport Transfer",
    "Transfer",
    "Spa",
    "Pool",
  ];

  const handleAccommodationChange = (index) => {
    setAccommodation(index, accommodation[index] === "1" ? "0" : "1");
  };
  const handleSave = async () => {
    try {
      await updateAccommodationOnServer(bookingtourId);
      toast.success("Accommodation saved successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Failed to save accommodation.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const startDate = tour?.startDate ? new Date(tour.startDate) : null;
  const endDate = tour?.endDate ? new Date(tour.endDate) : null;

  const formatDate = (date) =>
    date?.toLocaleDateString("km-KH", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  useEffect(() => {
    if (bookingtourId) fetchTour(bookingtourId);
    fetchGallery(bookingtourId);
  }, [bookingtourId, fetchTour, fetchGallery]);

  if (!tour)
    return (
      <div className="p-6 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-32 bg-gray-200 rounded w-full max-w-md mt-4"></div>
        </div>
      </div>
    );

  const selectedAccommodation = tour.accommodation
    ?.split("")
    .map((val, idx) => (val === "1" ? accommodationLabels[idx] : null))
    .filter((label) => Boolean(label));

  const bookingPercentage = tour.maxParticipants
    ? Math.round((tour.currentParticipants / tour.maxParticipants) * 100)
    : 0;

  return (
    <div>
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-white border-purple-200 text-purple-700 font-medium"
              >
                <Tag className="h-3 w-3 mr-1" />
                ID: {tour?.tour_id}
              </Badge>
              {tour.cancellation && (
                <Badge
                  variant="outline"
                  className="bg-white border-green-200 text-green-600"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Free Cancellation
                </Badge>
              )}
            </div>
            <div className="text-xs text-gray-500">
              Created: {new Date(tour.createdAt).toLocaleDateString()}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800 mt-2">
            {tour.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tour Info */}
            <div className="md:col-span-2 space-y-6">
              {/* Key Details Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="bg-purple-50 border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-purple-700 mb-1 text-nowrap">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs font-medium">Start Date</span>
                    </div>
                    <div className="font-semibold">
                      {" "}
                      {formatDate(startDate)}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-indigo-50 border-0">
                  <CardContent className="p-4 ">
                    <div className="flex items-center gap-2 text-indigo-700 mb-1 text-nowrap">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs font-medium">End Date</span>
                    </div>
                    <div className="font-semibold"> {formatDate(endDate)}</div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-blue-700 mb-1">
                      <Users className="h-4 w-4" />
                      <span className="text-xs font-medium">Bookings</span>
                    </div>
                    <div className="font-semibold text-center">
                      {totalSit}/{tour?.limit}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-teal-50 border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-teal-700 mb-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-xs font-medium">Price</span>
                    </div>
                    <div className="font-semibold">
                      ${tour.price?.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Booking Status */}
              {/* <Card className="border border-gray-100">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-700">
                      Booking Status
                    </h3>
                    <Badge
                      className={
                        bookingPercentage >= 80
                          ? "bg-red-500"
                          : bookingPercentage >= 50
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }
                    >
                      {bookingPercentage}% Booked
                    </Badge>
                  </div>
                  <Progress value={bookingPercentage} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{tour.currentParticipants} booked</span>
                    <span>
                      {tour?.limit - tour.currentParticipants} spots
                      left
                    </span>
                  </div>
                </CardContent>
              </Card> */}

              {/* Description */}
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600">{tour.description}</p>
              </div>

              {/* Accommodation */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3">
                  Accommodation
                </h3>
                <div className="flex flex-wrap gap-2">
                  {accommodationLabels.map((label, index) => {
                    const isChecked = accommodation[index] === "1";
                    return (
                      <div
                        key={label}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-md border transition ${
                          isChecked
                            ? "bg-purple-50 border-purple-300 shadow-sm"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <Checkbox
                          id={`accommodation-${index}`}
                          checked={isChecked}
                          onCheckedChange={() =>
                            handleAccommodationChange(index)
                          }
                          className={isChecked ? "text-purple-600" : ""}
                        />
                        <label
                          htmlFor={`accommodation-${index}`}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {label}
                        </label>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  <strong>Selected:</strong>{" "}
                  {selectedAccommodation.length > 0
                    ? selectedAccommodation.join(", ")
                    : "None"}
                </div>

                <div>
                  <Button
                    className="mt-4 bg-purple-600 hover:bg-purple-700"
                    onClick={handleSave}
                  >
                    Save Accommodation
                  </Button>
                  <ToastContainer />
                </div>
              </div>
            </div>

            {/* Gallery */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700 flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-purple-600" />
                Tour Gallery
              </h3>

              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden shadow-md h-[200px]">
                  <Image
                    src={gallery?.[0] || "/placeholder.svg"}
                    alt="Tour main image"
                    fill
                    className="object-cover"
                  />
                  <Button
                    variant="secondary"
                    className="absolute bottom-2 right-2 py-1 h-auto text-xs bg-black/70 text-white hover:bg-black/90"
                    onClick={() => setIsOpen(true)}
                  >
                    View All Photos ({gallery?.length || 0})
                  </Button>
                </div>

                {gallery?.length > 1 && (
                  <div className="grid grid-cols-3 gap-2">
                    {gallery.slice(1, 4).map((photo, index) => (
                      <div
                        key={index}
                        className="relative h-20 rounded-md overflow-hidden cursor-pointer"
                        onClick={() => {
                          setActivePhotoIndex(index + 1);
                          setIsOpen(true);
                        }}
                      >
                        <Image
                          src={photo || "/placeholder.svg"}
                          alt={`Tour thumbnail ${index + 1}`}
                          fill
                          className="object-cover hover:opacity-80 transition"
                        />
                        {index === 2 && gallery.length > 4 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-medium">
                            +{gallery.length - 4} more
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Info */}
              <Card className="border-purple-100 bg-purple-50/50">
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-medium text-gray-700">Quick Info</h3>

                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-purple-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Location</div>
                      <div className="text-xs text-gray-500">
                        {tour.start_location?.name || "N/A"}
                        {tour.first_destination?.name && (
                          <span className="inline-flex items-center">
                            <ChevronRight className="h-3 w-3" />
                            {tour.first_destination.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-purple-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Duration</div>
                      <div className="text-xs text-gray-500">
                        {calculateDuration(tour.startDate, tour.endDate)} days
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 text-purple-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Group Size</div>
                      <div className="text-xs text-gray-500">
                        Maximum {tour.maxParticipants} participants
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photo Gallery Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Tour Photos
          </DialogTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {gallery?.map((photo, index) => (
              <div
                key={index}
                className={`relative h-48 cursor-pointer hover:opacity-90 transition rounded-lg overflow-hidden ${
                  activePhotoIndex === index
                    ? "ring-2 ring-purple-500 ring-offset-2"
                    : ""
                }`}
                onClick={() => setActivePhotoIndex(index)}
              >
                <Image
                  src={photo || "/placeholder.svg"}
                  alt={`Tour view ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <DialogClose asChild>
            <Button variant="outline" className="mt-2">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper function to calculate duration between two dates
function calculateDuration(startDate, endDate) {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.abs(end - start);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
