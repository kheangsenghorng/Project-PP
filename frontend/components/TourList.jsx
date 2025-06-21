"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Heart, Star, Clock, Bus, Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Snowflake,
  Flame,
  Utensils,
  PawPrint,
  Dumbbell,
  Plane,
  Sparkles,
  Droplet,
  BedDouble,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Store imports - you'll need to create these stores
import { useTourStore } from "@/store/tourStore";
import { useFavoriteStore } from "@/store/favoriteStore";

export default function Home() {
  const params = useParams();
  const userId = params?.id;

  const { tours, fetchAllTours, loading, error } = useTourStore();

  const {
    favorites: favoriteList,
    addFavorite,
    removeFavorite,
    loading: loadingFavorite,
    error: errorFavorite,
    fetchFavorites,
  } = useFavoriteStore();

  const [filter, setFilter] = useState("highest");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState({});
  const [showAll, setShowAll] = useState(false);

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
  };
  const itemsPerPage = 5;

  useEffect(() => {
    fetchAllTours();
    if (userId) fetchFavorites(userId);

    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, [userId, fetchAllTours, fetchFavorites]);

  useEffect(() => {
    if (favoriteList) {
      const favMap = {};
      favoriteList.forEach((tour) => {
        favMap[tour._id] = true;
      });
      setFavorites(favMap);
    }
  }, [favoriteList]);

  const handleFavoriteClick = async (tourId) => {
    if (!userId) {
      toast.info("Please log in to favorite a tour.");
      return;
    }

    const updatedFavorites = { ...favorites };

    try {
      if (favorites[tourId]) {
        await removeFavorite(userId, tourId);
        delete updatedFavorites[tourId];
        toast.success("Removed from favorites.");
      } else {
        await addFavorite(userId, tourId);
        updatedFavorites[tourId] = true;
        toast.success("Added to favorites.");
      }

      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } catch (err) {
      toast.error("Failed to update favorites.");
    }
  };

  const isFavorite = (tourId) => !!favorites[tourId];

  const getDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const sortedTours =
    filter === "highest"
      ? [...tours].sort((a, b) => b.price - a.price)
      : [...tours].sort((a, b) => a.price - b.price);
      

  const getAccommodationFeatures = (binaryString) => {
    return Object.keys(accommodationIcons)
      .filter((_, index) => binaryString?.[index] === "1")
      .map((key) => key);
  };
  const newTours = sortedTours.filter((tour) => tour.isNew); // Filter new tours (add your condition)
  const nonNewTours = sortedTours
    .filter((tour) => !tour.isNew) // Exclude new tours
    .filter((tour) => tour.status?.toLowerCase() !== "full")
    .filter((tour) => tour.status?.toLowerCase() !== "close")
    .filter((tour) => tour.specialStatus?.toLowerCase() !== "sold out");

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const paginatedTours = nonNewTours.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );

  // Combine new tours with paginated non-new tours
  const currentTours = [...newTours, ...paginatedTours]; // Display new tours first

  // Calculate total pages for non-new tours only (pagination shouldn't count new tours)
  const totalPages = Math.ceil(nonNewTours.length / itemsPerPage);

  if (loading) return <p className="text-center">Loading...</p>;
  // if (error)
  //   return <p className="text-center text-red-500">{error || errorFavorite}</p>;
  // if (errorFavorite)
  //   return <p className="text-center text-red-500">{ errorFavorite}</p>;

  return (
    <div className="p-6">
      {/* Filter Controls */}
      <div className="flex justify-center w-[400px] mx-auto my-5">
        <div className="flex w-full bg-gray-100 rounded-full p-1">
          {["highest", "lowest"].map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`flex-1 text-sm font-medium rounded-full px-4 py-2 transition-all duration-200 ${
                filter === option
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {option === "highest"
                ? "From Highest to Lowest"
                : "From Lowest to Highest"}
            </button>
          ))}
        </div>
      </div>

      {/* Tour List */}
      <div className="grid gap-6">
        {currentTours.map((tour, index) => (
          <Card
            key={tour._id || index}
            className="shadow-md hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="relative w-full sm:w-80 h-64 sm:h-auto rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none overflow-hidden">
                  <Link
                    href={
                      userId
                        ? `/tour/${userId}/tour-detail/${tour._id}`
                        : `/tourpage/tour-detail/${tour._id}`
                    }
                  >
                    <Image
                      src={
                        tour.galleryImages?.[0]
                          ? `${tour.galleryImages?.[0]}`
                          : "/logo-edit.png"
                      }
                      alt={`Image of ${tour.tour_name} showing the main view`}
                      fill
                      className="object-cover"
                    />
                  </Link>
                </div>

                {/* Info */}
                <div className="p-6 flex flex-col w-full relative">
                  {/* Favorite Button */}
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleFavoriteClick(tour._id)}
                      className="hover:bg-rose-50"
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          isFavorite(tour._id)
                            ? "fill-rose-500 text-rose-500"
                            : ""
                        }`}
                      />
                    </Button>
                  </div>

                  <div>
                    <div className="mb-3 flex gap-2 flex-wrap">
                      <Badge className="bg-teal-100 text-teal-700">
                        {tour.tour_name || "Tour"}
                      </Badge>
                      {tour.status && (
                        <Badge
                          className={
                            tour.status === "Sold out"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-emerald-100 text-emerald-700"
                          }
                        >
                          {tour.status}
                        </Badge>
                      )}
                      {tour.specialStatus && (
                        <Badge
                          className={
                            tour.specialStatus === "Sold Out"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-emerald-100 text-emerald-700"
                          }
                        >
                          {tour.specialStatus}
                        </Badge>
                      )}
                    </div>

                    <Link
                      href={
                        userId
                          ? `/tour/${userId}/tour-detail/${tour._id}`
                          : `/tourpage/tour-detail/${tour._id}`
                      }
                    >
                      <h2 className="text-xl font-semibold mb-2 hover:text-rose-600">
                        {tour.first_destination?.name
                          ? tour.start_location?.name
                            ? `${tour.start_location.name} ↔ ${tour.first_destination.name}`
                            : tour.first_destination.name
                          : tour.start_location?.name}
                      </h2>
                    </Link>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {tour.overview}
                    </p>

                    <div className="flex items-center mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(tour.averageRating || 0)
                              ? "fill-amber-400 text-amber-400"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                      <span className="ml-2 font-medium">
                        {tour.averageRating || "0"}
                      </span>
                      <span className="ml-1 text-sm text-muted-foreground">
                        {tour.totalReviews
                          ? `(${tour.totalReviews} reviews)`
                          : "(No reviews yet)"}
                      </span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-rose-500" />
                        <span>
                          {getDuration(tour.startDate, tour.endDate)} days
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* display accommodation slice 0 to 4 icon */}
                          {getAccommodationFeatures(tour.accommodation)
                            ?.length > 0 ? (
                            // Slice to show 3 or 4 initially
                            getAccommodationFeatures(tour.accommodation)
                              .slice(
                                0,
                                showAll
                                  ? getAccommodationFeatures(tour.accommodation)
                                      .length
                                  : 2
                              ) // Show 3 initially
                              .map((feature) => (
                                <div
                                  key={feature}
                                  className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs text-gray-700"
                                >
                                  {accommodationIcons[feature]}
                                  <span className="capitalize">{feature}</span>
                                </div>
                              ))
                          ) : (
                            <span className="text-gray-500 text-sm">
                              No accommodation info
                            </span>
                          )}

                          {/* Show More / Show Less Button */}
                          {/* {getAccommodationFeatures(tour.accommodation)
                            ?.length > 3 && (
                            <button
                              onClick={() => setShowAll((prev) => !prev)}
                              className="mt-2 text-sm text-blue-500 flex items-center gap-1"
                            >
                              {showAll ? (
                                <>
                                  <ChevronUp className="h-4 w-4" />
                                  Show Less
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-4 w-4" />
                                  Show More
                                </>
                              )}
                            </button>
                          )} */}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-rose-500" />
                        <span>
                          {tour.status === "Sold out"
                            ? "Unavailable"
                            : "Available"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-bold text-2xl text-rose-600">
                        ${tour.price}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        /person
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`mx-2 px-4 py-2 rounded-md border ${
              currentPage === i + 1 ? "bg-rose-500 text-white" : "bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
