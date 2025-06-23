"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useReviewStore } from "@/store/reviewStore";

const Reviews = () => {
  const { tourId } = useParams();
  const {
    reviews,
    fetchAllReviews,
    isLoading,
    error,
    lengthuserRating,
    averageRating,
    ratingCounts,
  } = useReviewStore();

  useEffect(() => {
    if (tourId) {
      fetchAllReviews(tourId);
    }
  }, [tourId, fetchAllReviews]);

  const renderStars = (count) =>
    Array(5)
      .fill(0)
      .map((_, index) => (
        <svg
          key={index}
          xmlns="http://www.w3.org/2000/svg"
          fill={index < count ? "#22C55E" : "#E5E7EB"}
          viewBox="0 0 24 24"
          className="w-4 h-4"
        >
          <path d="M12 2.5l3.09 6.26L22 9.74l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.61 2 9.74l6.91-1.02L12 2.5z" />
        </svg>
      ));

  if (isLoading)
    return <div className="text-center text-gray-500">Loading reviews...</div>;

  // if (error)
  //   return <div className="text-center text-red-500 font-medium">{error}</div>;

  if (!reviews.length)
    return <div className="text-center text-gray-500">No reviews yet.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Title and Rating */}
      <div className="text-center mb-6 flex flex-wrap gap-4">
        <Link href="#Reviews" id="Reviews">
          <h2 className="text-2xl font-bold">Reviews</h2>
        </Link>

        <div className="flex items-center text-green-500 text-2xl font-bold space-x-2">
          <span>{averageRating?.toFixed(1)}</span>
          {renderStars(Math.round(averageRating))}
          <span className="text-gray-500 text-lg">
            ({lengthuserRating} reviews)
          </span>
        </div>
      </div>

      {/* Star Rating Breakdown */}
      <div className="mb-8">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = ratingCounts?.[star] || 0;
          const percentage =
            lengthuserRating > 0 ? (count / lengthuserRating) * 100 : 0;
          return (
            <div key={star} className="flex items-center space-x-4 mb-2">
              <div className="flex items-center">{renderStars(star)}</div>
              <div className="w-[280px]">
                <div className="bg-gray-200 h-1 rounded-full relative">
                  <div
                    className="bg-green-500 h-1 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-sm text-gray-500">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Review Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((review, index) => (
          <div key={index} className="bg-white p-4 rounded-lg flex space-x-4 ">
            <img
              src={review.copiedUser?.profile_image || "/placeholder.svg"}
              alt={review.copiedUser?.firstname || "Reviewer"}
              className="w-16 h-16 rounded-full border border-gray-300 shadow-lg object-cover"
            />
            <div>
              <h3 className="font-bold">
                {review.copiedUser?.firstname} {review.copiedUser?.lastname}
              </h3>
              <p className="text-gray-400 text-sm">
                {new Date(review.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <div className="flex space-x-1 my-2">
                {renderStars(review.rating)}
              </div>
              <p className="text-gray-600 text-sm line-clamp-2">
                {review.review || review.text}
              </p>
              <p className="text-gray-600 text-sm line-clamp-2">
                {review.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Show All Reviews Button */}
      {lengthuserRating > 6 && (
        <div className="mt-6 text-center">
          <button className="px-4 py-2 text-black border-2 rounded-md hover:bg-green-500 hover:text-white transition">
            Show All {lengthuserRating} Reviews
          </button>
        </div>
      )}
    </div>
  );
};

export default Reviews;
