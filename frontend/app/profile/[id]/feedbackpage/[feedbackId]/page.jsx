"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTourStore } from "@/store/tourStore";
import { useReviewStore } from "../../../../../store/reviewStore";
import { CheckCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function FeedbackForm() {
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState("");
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { addReview } = useReviewStore();
  const { fetchTour, tour } = useTourStore();
  const { id, feedbackId } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (feedbackId) fetchTour(feedbackId);
  }, [feedbackId, fetchTour]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === null || review === "") {
      alert("Please complete all required fields before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      await addReview({
        userId: id,
        tourId: feedbackId,
        rating,
        review,
        text,
      });

      setReview("");
      setText("");
      setIsSubmitted(true);

      // Optional: Redirect after delay
      setTimeout(() => {
        router.push(`/profile/${id}/feedback`); // Change to your desired route
      }, 3000);
    } catch (err) {
      console.error("Error submitting feedback:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-slate-700 dark:text-slate-300 animate-spin" />
          </div>
          <div className="h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-800 shadow-lg flex items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 text-lg font-medium text-slate-700 dark:text-slate-300"
        >
          Loading your profile...
        </motion.p>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-xl flex flex-col items-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-3 mb-4"
          >
            <CheckCircle className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2"
          >
            Thank you for your feedback!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-slate-600 dark:text-slate-300"
          >
            We appreciate you taking the time to share your thoughts with us.
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-8 rounded-lg shadow">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Travel <span className="text-green-500">With Us</span>
        </h1>
        <p className="text-gray-600">Thank you in advance for your feedback.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="hotelName" className="block text-sm font-medium mb-2">
            Name of Hotel
          </label>
          <input
            type="text"
            id="hotelName"
            value={tour?.tour_name || "Tour Booked"}
            disabled
            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Overall satisfaction with page{" "}
            <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-2">
            (1 = lowest and 5 = highest)
          </p>

          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setRating(val)}
                className={`flex-1 py-2 px-4 border rounded-md ${
                  rating === val
                    ? "bg-green-50 border-green-500 text-green-700"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {val} <span className="text-green-500">★</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            How would you summarize your experience?
          </label>
          <input
            type="text"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Great tour experience!"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="text" className="block text-sm font-medium mb-2">
            Please include anything else you'd like us to know
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded h-32"
            placeholder="The tour was very informative and fun! ..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
