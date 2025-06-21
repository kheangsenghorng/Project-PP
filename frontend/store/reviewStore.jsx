import { create } from "zustand";
import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const useReviewStore = create((set) => ({
  reviews: [],
  averageRating: 0,
  totalUserReviews: 0,
  lengthuserRating: 0,
  reviewsByTour: [],
  ratingCounts: {},
  tourStatus: "Ongoing",
  isLoading: false,
  error: null,
  totalReviews: 0,
  totalTopRatedTours: 0,
  groupedReviews: [],

  // Fetch reviews for a specific tour
  fetchReviews: async (id, tourId) => {
    set({ isLoading: true, error: null });

    try {
      const res = await axios.get(`${API_URL}/reviews/${id}/${tourId}`);
      set({
        reviews: res.data.reviews,
        averageRating: res.data.averageRating,
        lengthuserRating: res.data.lengthuserRating,
        ratingCounts: res.data.ratingCounts,
        tourStatus: res.data.tourStatus,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching reviews",
        isLoading: false,
      });
    }
  },

  fetchAllReviews: async (tourId) => {
    set({ isLoading: true, error: null });

    try {
      const res = await axios.get(`${API_URL}/reviews/${tourId}`);
      set({
        reviews: res.data.reviews,
        averageRating: res.data.averageRating,
        lengthuserRating: res.data.lengthuserRating,
        ratingCounts: res.data.ratingCounts,
        tourStatus: res.data.tourStatus,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching reviews",
        isLoading: false,
      });
    }
  },
  // Create a new review
  addReview: async ({ tourId, userId, rating, review, text }) => {
    set({ isLoading: true, error: null });

    try {
      const res = await axios.post(
        `${API_URL}/reviews/${tourId}/${userId}/review`,
        {
          rating,
          review,
          text,
        }
      );

      set((state) => ({
        reviews: [...state.reviews, res.data], // Add the new review to the list
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error creating review",
        isLoading: false,
      });
    }
  },

  // getReviewsByUser: async (userId) => {
  //   set({ loading: true, error: null });

  //   try {
  //     const response = await axios.get(
  //       `${API_URL}/reviews/${userId}/user/reviews`
  //     );
  //     const { userReviews, reviewsByTour } = response.data;

  //     set({
  //       reviews: userReviews,
  //       reviewsByTour, // already includes totalReviews
  //       totalUserReviews: userReviews.length,
  //       loading: false,
  //     });
  //   } catch (error) {
  //     set({
  //       error: error.response?.data?.message || "Failed to fetch reviews",
  //       loading: false,
  //     });
  //   }
  // },

  getReviewsByUser: async (userId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(
        `${API_URL}/reviews/${userId}/user/reviews`
      );
      const { userReviews, reviewsByTour } = response.data;

      // Merge totalReviews into each review
      const reviewsWithTotal = userReviews.map((review) => {
        const matchingTour = reviewsByTour.find(
          (tour) => tour.tourId === review.tourId._id
        );
        return {
          ...review,
          totalReviews: matchingTour?.totalReviews || 0,
          averageRating: matchingTour?.averageRating || 0,
        };
      });

      set({
        reviews: reviewsWithTotal,
        reviewsByTour,
        totalUserReviews: userReviews.length,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch reviews",
        isLoading: false,
      });
    }
  },

  fetchAllReview: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/reviews`); // Adjust if your endpoint is different
      const { groupedReviews, totalReviews } = response.data;
      set({
        groupedReviews,
        totalReviews,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch reviews",
        loading: false,
      });
    }
  },

  fetchTopRatedReviews: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/reviews/toprated`);
      const data = response.data;

      set({
        loading: false,
        totalReviews: data.totalReviews,
        totalTopRatedTours: data.totalTopRatedTours,
        groupedReviews: data.groupedReviews,
      });
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.message || error.message || "Failed to fetch",
      });
    }
  },
}));
