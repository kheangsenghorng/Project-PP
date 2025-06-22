"use client";

import Image from "next/image";
import {
  Heart,
  ArrowLeft,
  ChevronDown,
  Trash2,
  Users,
  Star,
  Clock,
  Bus,
  Calendar,
  Snowflake,
  Flame,
  Utensils,
  PawPrint,
  Dumbbell,
  Plane,
  Sparkles,
  Droplet,
  BedDouble,
} from "lucide-react";
import { useFavoriteStore } from "@/store/favoriteStore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function FavoritesPage() {
  const params = useParams();
  const { favorites, loading, error, fetchFavorites, removeFavorite } =
    useFavoriteStore();
  const [favorited, setFavorited] = useState(true);

  const accommodationIcons = {
    ac: <Snowflake className="h-4 w-4 text-blue-500" />,
    heating: <Flame className="h-4 w-4 text-orange-500" />,
    dishwasher: <Utensils className="h-4 w-4 text-green-500" />,
    petsAllowed: <PawPrint className="h-4 w-4 text-pink-500" />,
    fitnessCenter: <Dumbbell className="h-4 w-4 text-purple-500" />,
    airportTransfer: <Plane className="h-4 w-4 text-gray-600" />,
    Transfer: <Bus className="h-4 w-4 text-rose-500" />,
    Spa: <Sparkles className="h-4 w-4 text-amber-500" />,
    Pool: <Droplet className="h-4 w-4 text-sky-500" />,
    Roomtype: <BedDouble className="h-4 w-4 text-rose-500" />,
  };

  useEffect(() => {
    if (params.id) {
      fetchFavorites(params.id);
    }
  }, [params.id, fetchFavorites]);

  const handleClick = async (tourId) => {
    try {
      await removeFavorite(params.id, tourId);
      await fetchFavorites(params.id); // Refresh the list after removal
      toast.success("Tour removed from favorites!");
    } catch (error) {
      toast.error("Failed to remove tour from favorites.");
      console.error(error);
    }
  };

  const getDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const getAccommodationFeatures = (binaryString) => {
    return Object.keys(accommodationIcons)
      .filter((_, index) => binaryString?.[index] === "1")
      .map((key) => key);
  };

  // Pagination setup
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const totalPages = Math.ceil(favorites.length / itemsPerPage);

  const paginatedFavorites = favorites.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Go back"
          className="mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
            <h1 className="text-2xl font-semibold">My Favorites</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
            >
              <span className="text-sm">Sort by</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-muted-foreground">
          {favorites.length} favorites
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            Select
          </Button>
          <Button variant="ghost" size="sm">
            All
          </Button>
          <Button variant="ghost" size="sm" className="text-rose-500">
            <Trash2 className="h-4 w-4 mr-1" />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <Button variant="outline" className="rounded-full">
          <Users className="h-4 w-4 mr-2" />
          <span>Tour</span>
        </Button>
      </div>

      <div className="grid gap-6">
        {paginatedFavorites.map((tour, index) => (
          <div
            key={index}
            className={`relative ${
              tour.status === "Close" ? "pointer-events-none" : ""
            }`}
          >
            {["Close", "Full"].includes(tour.status) && (
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <div className="bg-black bg-opacity-70 text-white px-4 py-2 rounded text-sm">
                  {tour.status}
                </div>
              </div>
            )}

            <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/3 relative">
                    <Link href={`/tour/${params.id}/tour-detail/${tour._id}`}>
                      <div className="relative h-64 md:h-full">
                        <Image
                          src={
                            tour.galleryImages?.[0] ??
                            "/placeholder.svg?height=300&width=300"
                          }
                          alt={tour.title || "Tour image"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>
                  </div>
                  <div className="w-full md:w-2/3 p-6 relative">
                    <div className="absolute top-6 right-6">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleClick(tour._id)}
                        className="hover:bg-rose-50"
                      >
                        <Heart
                          className={`h-6 w-6 ${
                            favorited
                              ? "fill-red-500 text-red-500"
                              : "fill-gray-300 text-gray-300 hover:fill-gray-400 hover:text-gray-400"
                          }`}
                        />
                      </Button>
                    </div>

                    <div className="mb-3 flex flex-wrap gap-2">
                      <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-200">
                        {tour.tour_name || "Tour"}
                      </Badge>
                      {tour.status && (
                        <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200">
                          {tour.status}
                        </Badge>
                      )}
                      {tour.specialStatus && (
                        <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200">
                          {tour.specialStatus}
                        </Badge>
                      )}
                    </div>

                    <Link href={`/${params.id}/tour-detail/${tour._id}`}>
                      <h2 className="text-xl font-semibold mb-2 hover:text-rose-600 transition-colors">
                        {tour.first_destination?.name
                          ? tour.start_location?.name
                            ? `${tour.start_location.name} ↔ ${tour.first_destination.name}`
                            : tour.first_destination.name
                          : tour.start_location?.name}
                      </h2>
                    </Link>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {tour.description}
                    </p>

                    <div className="flex items-center mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= Math.round(tour.averageRating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                      <span className="ml-2 font-medium">
                        {tour.averageRating || "4.8"}
                      </span>
                      <span className="ml-1 text-sm text-muted-foreground">
                        ({tour.totalReviews || "124"} reviews)
                      </span>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
                            <Clock className="h-4 w-4 text-rose-500" />
                          </div>
                          <span>
                            {getDuration(tour.startDate, tour.endDate)} days
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex items-center gap-2 flex-wrap">
                            {getAccommodationFeatures(tour.accommodation)
                              .length > 0 ? (
                              getAccommodationFeatures(tour.accommodation)
                                .slice(0, 3)
                                .map((feature) => (
                                  <div
                                    key={feature}
                                    className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs text-gray-700"
                                  >
                                    {accommodationIcons[feature]}
                                    <span className="capitalize">
                                      {feature}
                                    </span>
                                  </div>
                                ))
                            ) : (
                              <span className="text-gray-500 text-sm">
                                No accommodation info
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-rose-500" />
                          </div>
                          <span>Available</span>
                        </div>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <div className="font-bold text-2xl text-rose-600">
                          ${tour.price || "1,299"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          /person
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            variant={currentPage === i + 1 ? "secondary" : "outline"}
            size="icon"
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}

        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          <ArrowLeft className="h-4 w-4 rotate-180" />
        </Button>
      </div>

      <ToastContainer />
    </div>
  );
}
