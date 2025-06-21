import { Review } from "../models/review-models.js";

export const getBaseUrl = (req) => {
  return process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
};

export const getReviewsForTour = async (tourId) => {
  const reviews = await Review.find({ tourId });

  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return {
    reviews,
    averageRating: parseFloat(averageRating.toFixed(1)),
    totalReviews: reviews.length,
  };
};

export const formatTour = async (tour, req) => {
  const baseUrl = getBaseUrl(req);
  const { averageRating, totalReviews } = await getReviewsForTour(tour._id);

  return {
    ...tour, // ✅ no toObject() here
    galleryImages: tour.galleryImages?.map(
      (image) => `${baseUrl}/${image}`
    ) || [],
    averageRating,
    totalReviews,
  };
};
