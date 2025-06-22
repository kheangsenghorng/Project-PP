import { Favorite } from "../models/favorite-models.js";
import { Review } from "../models/review-models.js";
import Tour from "../models/tour-models.js";
import { User } from "../models/user-models.js";

export const addFavorite = async (req, res) => {
  try {
    const { userId, tourId } = req.params; // Get IDs from URL parameters

    if (!userId || !tourId) {
      return res
        .status(400)
        .json({ message: "User ID and Tour ID are required" });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if tour exists
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    // Find the user's favorites
    let favorite = await Favorite.findOne({ userId });

    if (!favorite) {
      // If no favorites for the user, create a new favorite object
      favorite = new Favorite({
        userId,
        tourIds: [tourId], // Start with this one tourId in the array
        addedDate: new Date(), // Store timestamp
      });
    } else {
      // If favorites exist, check if the tourId is already in the array
      if (favorite.tourIds.includes(tourId)) {
        return res.status(400).json({ message: "Tour already in favorites" });
      }

      // Add the new tourId to the favorite's array
      favorite.tourIds.push(tourId);
    }

    // Save the favorite object
    await favorite.save();

    res.status(201).json({
      message: "Tour added to favorites successfully",
      favorite: {
        _id: favorite._id,
        userId: favorite.userId,
        tourIds: favorite.tourIds,
        addedAt: favorite.addedDate,
      },
    });
  } catch (error) {
    console.error("Error adding favorite:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Remove a tour from favorites

export const removeFavorite = async (req, res) => {
  try {
    const { userId, tourId } = req.params; // Get IDs from URL parameters

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the tour exists
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    // Find the user's favorite document
    const favorite = await Favorite.findOne({ userId });

    // If no favorite document is found for the user
    if (!favorite) {
      return res
        .status(404)
        .json({ message: "No favorites found for this user" });
    }

    // Check if the tourId exists in the favorite's tourIds array
    if (!favorite.tourIds.includes(tourId)) {
      return res.status(400).json({ message: "Tour not found in favorites" });
    }

    // Remove the tourId from the tourIds array
    favorite.tourIds = favorite.tourIds.filter(
      (id) => id.toString() !== tourId
    );

    // If the array becomes empty, delete the favorite document
    if (favorite.tourIds.length === 0) {
      await favorite.deleteOne(); // Use deleteOne() to remove the document
    } else {
      await favorite.save(); // Save the modified document
    }

    res.status(200).json({ message: "Successfully removed the favorite" });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Get all favorite tours for a user

// export const getUserFavoriteTours = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     if (!userId) {
//       return res.status(400).json({ message: "User ID is required" });
//     }

//     // Check if user exists
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Fetch the user's favorites with tourIds array
//     const favorites = await Favorite.findOne({ userId }).lean();

//     if (!favorites || favorites.tourIds.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No favorite tours found for this user" });
//     }

//     // Extract the array of tourIds from the favorites
//     const tourIds = favorites.tourIds;

//     // Fetch all the tours whose IDs are in the tourIds array
//     const tours = await Tour.find({ _id: { $in: tourIds } }).lean();

//     if (tours.length === 0) {
//       return res.status(404).json({ message: "No matching tours found" });
//     }

//     const userReviews = await Review.findOne({ userId }).lean();

//     if (!userReviews || userReviews.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No favorite tours found for this user" });
//     }

//     // Add gallery images with the full URL
//     // const updatedTours = tours.map((tour) => ({
//     //   ...tour,
//     //   galleryImages: tour.galleryImages.map(
//     //     (image) => `${req.protocol}://${req.get("host")}/uploads/tours/${image}`
//     //   ),
//     // }));
//     const baseUrl =
//       process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
//     const updatedTours = tours.map((tour) => ({
//       ...tour,
//       galleryImages: tour.galleryImages.map(
//         (image) => `${baseUrl}/uploads/tours/${image}`
//       ),
//     }));

//     res.status(200).json({
//       message: "User's favorite tours retrieved successfully",
//       tours: updatedTours,
//     });
//   } catch (error) {
//     console.error("Error fetching user's favorite tours:", error);
//     res
//       .status(500)
//       .json({ message: "Internal Server Error", error: error.message });
//   }
// };

export const getUserFavoriteTours = async (req, res) => {
  try {
    const { userId } = req.params;

    const baseUrl =
      process.env.BASE_URL || `${req.protocol}:/${req.get("host")}`;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Step 1: Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 2: Fetch favorites
    const favorites = await Favorite.findOne({ userId }).lean();
    if (!favorites || !favorites.tourIds?.length) {
      return res
        .status(404)
        .json({ message: "No favorite tours found for this user" });
    }

    const tourIds = favorites.tourIds;

    // Step 3: Fetch favorite tours
    const tours = await Tour.find({ _id: { $in: tourIds } })
      .populate("start_location", "name")
      .populate("first_destination", "name")
      .populate("second_destination", "name")
      .lean();
    if (!tours.length) {
      return res.status(404).json({ message: "No matching tours found" });
    }

    // Step 4: For each tour, fetch all reviews and compute average
    const reviewsByTour = await Promise.all(
      tourIds.map(async (tourId) => {
        const allReviews = await Review.find({ tourId }).populate("userId");
        const averageRating =
          allReviews.length > 0
            ? allReviews.reduce((acc, r) => acc + r.rating, 0) /
              allReviews.length
            : 0;

        return {
          tourId,
          reviews: allReviews,
          totalReviews: allReviews.length,
          averageRating: averageRating.toFixed(1),
        };
      })
    );

    // Step 5: Update gallery image URLs
    const updatedTours = tours.map((tour) => ({
      ...tour,
      galleryImages:
        tour.galleryImages?.map((img) => `${baseUrl}/${img}`) || [],
    }));

    res.status(200).json({
      message: "User's favorite tours retrieved successfully",
      tours: updatedTours,
      reviewsByTour,
    });
  } catch (error) {
    console.error("Error fetching user's favorite tours:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
