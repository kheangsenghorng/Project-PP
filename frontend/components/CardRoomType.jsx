"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useInfoItemStore } from "@/store/useInfoItemStore";
import { useEffect, useState } from "react";

export default function AdditionalInfo() {
  const { id, tourId } = useParams();
  const { infoItems, loading, error, fetchInfoItems } = useInfoItemStore();
  const [visibleCount, setVisibleCount] = useState(6); // Show 6 items initially

  useEffect(() => {
    if (tourId) fetchInfoItems(tourId);
  }, [tourId]);

  const visibleItems = infoItems.slice(0, visibleCount);
  const midIndex = Math.ceil(visibleItems.length / 2);
  const leftColumn = visibleItems.slice(0, midIndex);
  const rightColumn = visibleItems.slice(midIndex);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 14);
  };

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto">
      <Link href="#AdditionalInfo" id="AdditionalInfo">
        <h1 className="text-3xl font-bold mb-6">Additional Info</h1>
      </Link>

      <div className="bg-white rounded-lg p-6">
        {loading && (
          <p className="text-center text-gray-500 font-medium">
            Loading info...
          </p>
        )}

        {error && (
          <p className="text-center text-red-500 font-medium">Error: {error}</p>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {leftColumn.map((info, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-gray-600 mr-2">•</span>
                    <p className="text-gray-700">{info.text}</p>
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {rightColumn.map((info, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-gray-600 mr-2">•</span>
                    <p className="text-gray-700">{info.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Show More Button */}
            {visibleCount < infoItems.length && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleShowMore}
                  className="text-blue-600 px-8 py-3 hover:bg-green-600 rounded-full hover:text-white font-semibold transition border"
                >
                  Show 14 more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
