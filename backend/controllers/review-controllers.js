import { Review } from "../models/review-models.js";
import Tour from "../models/tour-models.js";
import { TourHistorybooking } from "../models/tour-history_bookings.js";
import { User } from "../models/user-models.js";

// Create a new review
export const createReview = async (req, res) => {
  const { tourId, userId } = req.params;
  try {
    const { rating, review, text, bookingDate } = req.body;

    // Check if the user has already reviewed this tour
    const existingReview = await Review.findOne({ tourId, userId });
    if (existingReview) {
      return res.status(400).json({ message: "Review already exists" });
    }

    // Check if the tourId and userId are valid
    const tour = await TourHistorybooking.findOne({ tourId });
    if (!tour) {
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Create the review
    const newReview = new Review({
      tourId,
      userId,
      rating,
      review,
      text,
      bookingDate,
    });

    // Save the review to the database
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating review", error });
  }
};

// Get all reviews for a specific tour, calculate the average rating, count the ratings, and check tour status
export const getReviewsByTourId = async (req, res) => {
  try {
    const { tourId } = req.params;

    // Find booking that includes tour data
    const booking = await TourHistorybooking.findOne({ tourId }).populate(
      "tourId"
    );

    if (!booking || !booking.tourId) {
      return res.status(404).json({ message: "Tour not found" });
    }

    const tour = booking.tourId;

    // Get all reviews for the tour
    const reviews = await Review.find({ tourId }).populate("userId");

    if (!reviews || reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this tour" });
    }

    // Calculate average rating
    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    // Count how many reviews for each rating level
    const ratingCounts = reviews.reduce((counts, r) => {
      counts[r.rating] = (counts[r.rating] || 0) + 1;
      return counts;
    }, {});

    const lengthuserRating = reviews.length;

    // Base URL for generating full image path
    const baseUrl =
      process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;

    const responseReviews = await Promise.all(
      reviews.map(async (review) => {
        const user = review.userId;

        const copiedTour = {
          ...tour.toObject(),
          galleryImages:
            tour.galleryImages?.map((img) => `${baseUrl}/${img}`) || [],
        };

        const copiedUser = {
          ...user.toObject(),
          profile_image: user.profile_image
            ? `${baseUrl}/${user.profile_image}`
            : null,
        };

        return {
          ...review.toObject(),
          copiedTour,
          copiedUser,
        };
      })
    );

    return res.status(200).json({
      averageRating,
      ratingCounts,
      lengthuserRating,
      reviews: responseReviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ message: "Error fetching reviews", error });
  }
};

// Get reviews by user ID
export const getreviewsUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const baseUrl =
      process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;

    // Step 1: Find all reviews from this user
    const userReviews = await Review.find({ userId }).populate({
      path: "tourId",
      populate: ["start_location", "first_destination", "second_destination"],
    });

    if (!userReviews || userReviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this user" });
    }

    // Step 2: Get all unique tour IDs from user's reviews
    const tourIds = [
      ...new Set(userReviews.map((review) => review.tourId?._id?.toString())),
    ];

    // Step 3: For each tour, find all reviews
    const reviewsByTour = await Promise.all(
      tourIds.map(async (tourId) => {
        const allReviews = await Review.find({ tourId }).populate("userId");

        const averageRating =
          allReviews.reduce((acc, review) => acc + review.rating, 0) /
          allReviews.length;

        return {
          tourId,
          reviews: allReviews,
          totalReviews: allReviews.length,
          averageRating: averageRating.toFixed(1),
        };
      })
    );

    // Step 4: Update image URLs in each tour inside user reviews
    const updatedUserReviews = userReviews.map((review) => {
      const tour = review.tourId;

      if (tour && Array.isArray(tour.galleryImages)) {
        tour.galleryImages = tour.galleryImages.map(
          (image) => `${baseUrl}/${image}`
        );
      }

      return review;
    });

    res.status(200).json({
      userReviews: updatedUserReviews,
      reviewsByTour, // all reviews for each tour the user reviewed
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user and tour reviews", error });
  }
};

// Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const baseUrl =
      process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;

    // Fetch all reviews with populated tour and user data
    const reviews = await Review.find().populate("tourId userId");

    const reviewsMap = {};

    // Group reviews by tour
    for (const review of reviews) {
      const tour = review.tourId;
      const tid = tour._id.toString();

      if (!reviewsMap[tid]) {
        // Update gallery image URLs here
        const updatedGalleryImages =
          tour.galleryImages?.map((img) => `${baseUrl}/${img}`) || [];

        reviewsMap[tid] = {
          tour: {
            ...tour.toObject(), // convert Mongoose document to plain object
            galleryImages: updatedGalleryImages,
          },
          reviews: [],
          totalReviews: 0,
          totalRating: 0,
        };
      }

      reviewsMap[tid].reviews.push(review);
      reviewsMap[tid].totalReviews += 1;
      reviewsMap[tid].totalRating += review.rating;
    }

    // Format grouped response
    const groupedReviews = Object.values(reviewsMap).map((group) => ({
      tour: group.tour,
      reviews: group.reviews,
      totalReviews: group.totalReviews,
      averageRating: (group.totalRating / group.totalReviews).toFixed(1),
    }));

    res.status(200).json({
      totalReviews: reviews.length,
      groupedReviews,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error });
  }
};

// Get reviews for a specific tour
// export const getReviewsByTour = async (req, res) => {
//   try {
//     const { tourId } = req.params;
//     const reviews = await Review.find({ tourId }).populate("userId");
//     res.status(200).json(reviews);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching tour reviews", error });
//   }
// };

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error });
  }
};

export const getAllTopRatedReviews = async (req, res) => {
  try {
    const baseUrl =
      process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;

    // Fetch all reviews with populated tour and user data
    const reviews = await Review.find()
      .populate("userId")
      .populate({
        path: "tourId",
        populate: [
          { path: "start_location" },
          { path: "first_destination" },
          { path: "second_destination" },
        ],
      });

    const reviewsMap = {};

    for (const review of reviews) {
      const tour = review.tourId;

      // Skip if no tour linked or invalid
      if (!tour || !tour._id) continue;

      const tid = tour._id.toString();

      if (!reviewsMap[tid]) {
        const updatedGalleryImages = Array.isArray(tour.galleryImages)
          ? tour.galleryImages.map((img) => `${baseUrl}/${img}`)
          : [];

        reviewsMap[tid] = {
          tour: {
            ...tour.toObject(),
            galleryImages: updatedGalleryImages,
          },
          reviews: [],
          totalReviews: 0,
          totalRating: 0,
        };
      }

      reviewsMap[tid].reviews.push(review);
      reviewsMap[tid].totalReviews += 1;
      reviewsMap[tid].totalRating += review.rating;
    }

    const topRatedThreshold = 4;

    const groupedReviews = Object.values(reviewsMap)
      .map((group) => ({
        tour: group.tour,
        reviews: group.reviews,
        totalReviews: group.totalReviews,
        averageRating: parseFloat(
          (group.totalRating / group.totalReviews).toFixed(1)
        ),
      }))
      .filter((group) => group.averageRating >= topRatedThreshold);

    res.status(200).json({
      totalReviews: reviews.length,
      totalTopRatedTours: groupedReviews.length,
      groupedReviews,
    });
  } catch (error) {
    console.error("Error in getAllTopRatedReviews:", error);
    res.status(500).json({ message: "Error fetching reviews", error });
  }
};
