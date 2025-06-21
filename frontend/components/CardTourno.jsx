"use client";

import "font-awesome/css/font-awesome.min.css";
import { useTourStore } from "@/store/tourStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CardTour2 = () => {
  const router = useRouter();

  const { galleryImages, fetchGalleryImages, loading, error } = useTourStore();

  const [favoritedTours, setFavoritedTours] = useState({});

  useEffect(() => {
    fetchGalleryImages();
  }, [fetchGalleryImages]);

  const displayedTours = galleryImages.slice(4, 8);

  const handleClick = async (tourId) => {
    if (!id) {
      router.push(`/login`);
    }
    // If the user is not logged in, redirect to login page
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <section>
      <div className="container mx-auto my-5 px-4 max-w-screen-xl">
        <h4 className="mb-4 border rounded text-2xl p-3">New Arrivals</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-4">
          {displayedTours.map((tour) => (
            <div
              key={tour._id}
              className="card border rounded-lg shadow-sm relative hover:shadow-md transition-shadow duration-300"
            >
              <Link href={`/tour-detail/${tour._id}`}>
                <img
                  src={tour?.galleryImages?.[0] || "/default-image.jpg"}
                  className="w-full h-56 object-cover rounded-t-lg"
                  alt={`Tour from ${tour?.first_destination} to ${tour?.second_destination}`}
                />
              </Link>

              <div className="p-4">
                <p className="mt-2 mb-0">
                  {tour?.first_destination} <span className="mx-2">↔</span>{" "}
                  {tour?.second_destination}
                </p>
                <h5 className="font-bold text-xl mb-0">$350</h5>
                <p className="text-gray-600 mb-2 text-sm">
                  Period: 2 nights and 3 days
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center md:justify-end">
          <Link href="/list-tour" passHref>
            <button className="px-9 py-2 rounded-full border border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors duration-300">
              View More Tours
            </button>
          </Link>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </section>
  );
};

export default CardTour2;
