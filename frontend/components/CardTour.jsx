"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Heart } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useTourStore } from "@/store/tourStore";
import { useFavoriteStore } from "@/store/favoriteStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useReviewStore } from "@/store/reviewStore";

const CardTour = () => {
  const router = useRouter();
  const { id } = useParams(); // User ID (if logged in)

  const { galleryImages, fetchGalleryImages, loading, error } = useTourStore();
  const {
    favorites,
    addFavorite,
    removeFavorite,
    loading: loadingFavorite,
    error: errorFavorite,
    fetchFavorites,
  } = useFavoriteStore();

  const {
    loading: reviewsLoading,
    error: reviewsError,
    groupedReviews,
    fetchTopRatedReviews,
  } = useReviewStore();

  useEffect(() => {
    fetchTopRatedReviews();
  }, []);

  const [favoritedTours, setFavoritedTours] = useState({});

  useEffect(() => {
    fetchGalleryImages();
    if (id) {
      fetchFavorites(id); // Fetch user favorites if logged in
    }
  }, [fetchGalleryImages, id, fetchFavorites]);

  // Sync favoritedTours state with fetched favorites
  useEffect(() => {
    if (favorites) {
      const favoriteMap = {};
      favorites.forEach((tour) => {
        favoriteMap[tour._id] = true;
      });
      setFavoritedTours(favoriteMap);
    }
  }, [favorites]);

  const getDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate total number of days
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (totalDays <= 0) return "Invalid dates";

    const nights = totalDays - 1;
    return `${nights} night${nights > 1 ? "s" : ""} and ${totalDays} day${
      totalDays > 1 ? "s" : ""
    }`;
  };

  // Always display the first 4 tours
  const displayedTours = groupedReviews
    .filter((tour) => {
      const status = tour?.tour?.status?.toLowerCase();
      return status !== "close" && status !== "full";
    })
    .slice(0, 4);

  const handleClick = async (tourId) => {
    if (!id) {
      router.push(`/login`); // Redirect if not logged in
      return;
    }

    try {
      const updatedFavorites = { ...favoritedTours };
      if (favoritedTours[tourId]) {
        await removeFavorite(id, tourId);
        toast.success("Tour removed from favorites!");
        delete updatedFavorites[tourId];
      } else {
        await addFavorite(id, tourId);
        toast.success("Tour added to favorites!");
        updatedFavorites[tourId] = true;
      }

      setFavoritedTours(updatedFavorites); // Update UI instantly
    } catch (err) {
      toast.error(err.message);
    }
  };

  // if (loading || loadingFavorite)
  //   return <p className="text-center">Loading...</p>;
  // if (error) return <p className="text-center text-red-500">{error}</p>;
  // if (errorFavorite)
  //   return <p className="text-center text-red-500">{errorFavorite}</p>;

  const href = id ? `/tour/${id}/list-tour` : "/tourpage/list-tour";
  return (
    <section className="py-8">
      <div className="container mx-auto px-4 max-w-screen-xl">
        {/* Only show "Best Selections" if user has favorites */}
        {id && favorites.length > 0 && (
          <h4 className="mb-6 text-2xl font-semibold border-b pb-2">
            Best Selections
          </h4>
        )}

        {/* Tour cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
          {displayedTours.map((tour, index) => (
            <Card
              key={index}
              className="overflow-hidden group hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative">
                <Link
                  href={
                    id
                      ? `/tour/${id}/tour-detail/${tour?.tour?._id}`
                      : `/tourpage/tour-detail/${tour?.tour?._id}`
                  }
                >
                  <div className="w-full h-56 overflow-hidden">
                    <img
                      src={
                        tour?.tour?.galleryImages?.[0] || "/image/logo-edit.png"
                      }
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      alt={`Tour from ${tour?.tour.first_destination?.name} to ${tour?.tour?.first_destination}`}
                    />
                  </div>
                </Link>

                {id && (
                  <button
                    className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition-colors duration-200"
                    onClick={() => handleClick(tour.tour._id)}
                    aria-label={
                      favoritedTours[tour._id]
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    <Heart
                      className={`h-5 w-5 transition duration-300 ${
                        favoritedTours[tour.tour._id]
                          ? "fill-red-500 text-red-500"
                          : "fill-transparent text-gray-600 hover:text-red-400"
                      }`}
                    />
                  </button>
                )}
              </div>

              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm text-gray-600">
                    {tour?.tour?.start_location?.name}{" "}
                    <span className="mx-1">↔</span>{" "}
                    {tour?.tour?.first_destination?.name}
                  </p>
                  <p className="font-bold text-lg">${tour?.tour?.price}</p>
                </div>
                <p className="text-gray-500 text-sm">
                  Period: {getDuration(tour.tour.startDate, tour.tour.endDate)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-center md:justify-end">
          <Link href={href} passHref>
            <Button
              variant="outline"
              className="px-8 rounded-full border-green-600 text-green-700 hover:bg-green-600 hover:text-white hover:border-green-600"
            >
              View All Packages
            </Button>
          </Link>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </section>
  );
};

export default CardTour;
