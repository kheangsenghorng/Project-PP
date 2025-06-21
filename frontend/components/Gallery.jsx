"use client";

import { useTourStore } from "@/store/tourStore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Gallery() {
  const { id, tourId } = useParams();
  const { gallery, loading, error, fetchGallery } = useTourStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (tourId) {
      fetchGallery(tourId);
    }
  }, [tourId]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="container my-24 mx-auto p-4 w-[1200px]">
      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Main Image */}
        <div className="relative">
          {gallery ? (
            <img
              src={gallery?.[0]}
              alt={gallery?.tour_name || "Tour Image"}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          ) : (
            <p className="text-center text-gray-500">No images available</p>
          )}
        </div>

        {/* Side Images */}
        <div className="grid grid-cols-2 gap-2">
          {gallery?.slice(1, 4).map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Photo ${index + 1}`}
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
          ))}

          {/* Button for More Photos */}
          {gallery?.length > 4 && (
            <div className="relative">
              <img
                src={gallery?.[4]}
                alt="Photo 4"
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
              <button
                onClick={handleOpenModal}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-lg font-semibold rounded-lg"
              >
                +{gallery.length - 4} More Photos
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Additional Photos */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-[80%] max-w-2xl">
            <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {gallery?.slice(5).map((image, index) => (
                <img
                  key={index}
                  src={image}
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

      {/* Full Gallery Section */}
    </div>
  );
}
