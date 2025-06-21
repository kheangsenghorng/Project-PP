"use client";

import { useParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ListFilter,
  MessageSquare,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useReviewStore } from "@/store/reviewStore";
import { usePastToursStore } from "@/store/usePastToursStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TourCard from "@/components/tour-card";
import FeedbackCard from "@/components/feedback-card";

export default function TourFeedbackNew() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("tours");

  // Get reviews
  const {
    reviews,
    getReviewsByUser,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useReviewStore();

  // Get past tours
  const {
    tours,
    loading: toursLoading,
    error: toursError,
    fetchPastTours,
  } = usePastToursStore();

  // Fetch tours and reviews
  useEffect(() => {
    if (id) {
      fetchPastTours(id);
      getReviewsByUser(id);
    }
  }, [id, fetchPastTours, getReviewsByUser]);

  // Error state
  if (toursError) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Unable to load data
          </h3>
          <p className="text-red-600">
            {reviewsError || toursError || "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  // Filter tours for feedback
  const toursWithFeedback = reviews.filter((review) => !!review.rating);
  const toursWithoutFeedback = reviews.filter((review) => !review.rating);

  const displayData =
    activeTab === "feedback" ? toursWithFeedback : tours || [];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="mb-8">
        <Tabs defaultValue="tours" onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {activeTab === "tours" ? "Your Tours" : "Your Feedback"}
            </h1>
            <TabsList className="grid grid-cols-2 w-full sm:w-[280px]">
              <TabsTrigger value="tours" className="text-sm">
                Tours
              </TabsTrigger>
              <TabsTrigger value="feedback" className="text-sm">
                Feedback
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tours Tab */}
          <TabsContent value="tours">
            {displayData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <TourCard userId={id} />
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
                <ListFilter className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-700">
                  No tours found
                </h3>
                <p className="text-gray-500 mt-1 max-w-md mx-auto">
                  You don't have any tours in your history yet. Book a tour to
                  get started!
                </p>
              </div>
            )}
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback">
            {displayData.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {displayData.map((tour, index) => (
                  <FeedbackCard
                    key={tour._id || index}
                    tour={tour}
                    userId={id}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
                <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-700">
                  No feedback yet
                </h3>
                <p className="text-gray-500 mt-1 max-w-md mx-auto">
                  You haven't provided feedback for any tours. Your insights
                  help us improve!
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Pagination - Only if more than 6 */}
      {displayData.length > 6 && (
        <div className="flex justify-center items-center mt-8">
          <nav
            className="inline-flex bg-white rounded-lg shadow-sm p-1"
            aria-label="Pagination"
          >
            <button className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-gray-50 transition-colors">
              <ChevronLeft className="w-4 h-4" />
              <span className="sr-only">Previous</span>
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-md bg-primary text-white font-medium">
              1
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-4 h-4" />
              <span className="sr-only">Next</span>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
