"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useParams } from "next/navigation";
import { useReviewStore } from "../store/reviewStore";

export default function ReviewCardAttachment() {
  const params = useParams();
  const id = params?.id;
  const tourId = params?.tourId;

  const { reviews, fetchReviews, isLoading, error } = useReviewStore();
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleReview = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  useEffect(() => {
    if (id && tourId) {
      fetchReviews(id, tourId);
    }
  }, [id, tourId, fetchReviews]);

  if (isLoading) return <div>Loading reviews...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!reviews.length) return <div>No reviews yet</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {reviews.map((review, index) => {
        const isExpanded = expandedIndex === index;

        return (
          <div key={review._id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={review?.copiedUser?.profile_image || "/placeholder.svg"}
                  alt={review.copiedUser?.firstname || "Reviewer"}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div>
                <div className="font-medium text-nowrap">
                  {review.copiedUser?.firstname || "Anonymous"}{" "}
                  {review.copiedUser?.lastname || "Anonymous"}
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={
                        star <= review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
              </div>
              <div className="ml-auto text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                {/* <span className="mx-1">•</span>
                {new Date(review.createdAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })} */}
              </div>
            </div>

            {/* Review content */}
            <p
              className={`text-sm text-gray-600 ${
                !isExpanded ? "line-clamp-2" : ""
              }`}
            >
              {review.review}
            </p>
            <p
              className={`text-sm text-gray-600 ${
                !isExpanded ? "line-clamp-2" : ""
              }`}
            >
              {review.text}
            </p>

            {/* Toggle button */}
            {(review.review?.length > 100 || review.text?.length > 100) && (
              <button
                onClick={() => toggleReview(index)}
                className="text-green-500 text-sm mt-1 hover:underline"
              >
                {isExpanded ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
