// controllers/tourController.js
import Tour from "../models/tour-models.js";

import { getReviewsForTour, getBaseUrl } from "../utils/formatTour.js";

export const updateAccommodationById = async (req, res) => {
  const { tourId } = req.params;
  const { accommodation } = req.body; // Expect: ["1", "0", "1", ...]

  // Validate that it's an array and only contains "0" or "1"
  if (
    !Array.isArray(accommodation) ||
    !accommodation.every((val) => val === "0" || val === "1")
  ) {
    return res.status(400).json({
      message: "Accommodation must be an array of '0' or '1' strings.",
    });
  }

  try {
    // Pad or slice to exactly 8 bits
    const paddedAccommodation = [...accommodation];
    while (paddedAccommodation.length < 10) {
      paddedAccommodation.push("0");
    }

    const accommodationMask = paddedAccommodation.slice(0, 10).join("");

    const updatedTour = await Tour.findByIdAndUpdate(
      tourId,
      { accommodation: accommodationMask },
      { new: true }
    );

    if (!updatedTour) {
      return res.status(404).json({ message: "Tour not found." });
    }

    res.status(200).json(updatedTour);
  } catch (error) {
    console.error("Error updating accommodation:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Format a single tour with image URLs and rating info
export const formatTour = async (tour, req) => {
  const baseUrl = getBaseUrl(req);
  const { averageRating, totalReviews } = await getReviewsForTour(tour._id);

  return {
    ...tour.toObject(), // Ensure plain JS object
    galleryImages:
      tour.galleryImages?.map((image) => `${baseUrl}/uploads/tours/${image}`) ||
      [],
    averageRating,
    totalReviews,
  };
};

// Controller: Get tours by accommodation binary string
export const getToursByAccommodation = async (req, res) => {
  const { accommodation } = req.query; // Expected: "10100000"

  // Validate input format
  if (!accommodation || !/^[01]{8}$/.test(accommodation)) {
    return res.status(400).json({
      message: "Accommodation must be an 8-character string of '0' or '1'.",
    });
  }

  try {
    const allTours = await Tour.find();

    const matchedTours = allTours.filter((tour) => {
      if (!tour.accommodation || tour.accommodation.length !== 8) return false;

      // Match only if each "1" in the query is present in the tour's accommodation
      for (let i = 0; i < 8; i++) {
        if (accommodation[i] === "1" && tour.accommodation[i] !== "1") {
          return false;
        }
      }

      return true;
    });

    if (matchedTours.length === 0) {
      return res.status(404).json({ message: "No matching tours found." });
    }

    // Add formatted URLs and ratings
    const formatted = await Promise.all(
      matchedTours.map((tour) => formatTour(tour, req))
    );

    return res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching tours by accommodation:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};
