import Tour from "../models/tour-models.js";
import { User } from "../models/user-models.js";
import { Itinerary } from "../models/itinerary-models.js"; // Import Itinerary model
// Display all tours
import { Review } from "../models/review-models.js"; // Import Review model
import { formatTour, getReviewsForTour } from "../utils/formatTour.js";
import fs from "fs";
import { uploadTourImages } from "../utils/processUploadedFile.js";
import { createItineraryEntry } from "../services/itineraryService.js";
import Location from "../models/loaction-models.js";
import { Category } from "../models/category-models.js";
import { Tourbooking } from "../models/tour-booking-models.js";

export const createTour = async (req, res) => {
  try {
    const {
      tour_name,
      description,
      price,
      start_location,
      first_destination,
      second_destination,
      startDate,
      endDate,
      status,
      overview,
      category,
      limit,
      itineraries,
    } = req.body;

    // 1. Upload images using helper function
    const { success, uploadedFiles, message } = await uploadTourImages(req);
    if (!success) {
      return res.status(400).json({ success: false, message });
    }

    // // 2. Auto-generate tour_id with format TTHH<number>
    // const lastTour = await Tour.findOne({ tour_id: { $regex: /^TTHH\d+$/ } })
    //   .sort({ tour_id: -1 })
    //   .select("tour_id");

    // let newNumericId = 1;
    // if (lastTour?.tour_id) {
    //   const match = lastTour.tour_id.match(/^TTHH(\d+)$/);
    //   if (match?.[1]) {
    //     newNumericId = parseInt(match[1], 10) + 1;
    //   }
    // }
    // const tour_id = `TTHH${newNumericId}`;
    const currentYear = new Date().getFullYear();

    // Find the last tour ID that matches the format "BK-<YEAR>-<4_DIGITS>"
    const lastTour = await Tour.findOne({
      tour_id: { $regex: `^T-${currentYear}-\\d{4}$` },
    })
      .sort({ tour_id: -1 })
      .select("tour_id");

    let newNumericId = 1;

    if (lastTour?.tour_id) {
      const match = lastTour.tour_id.match(/^T-\d{4}-(\d{4})$/);
      if (match?.[1]) {
        newNumericId = parseInt(match[1], 10) + 1;
      }
    }

    // Pad the number with leading zeros to always have 4 digits
    const paddedId = String(newNumericId).padStart(4, "0");
    const tour_id = `T-${currentYear}-${paddedId}`;

    // 3. Find admin user (assumed only one admin)
    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found. Cannot create a tour without an admin.",
      });
    }

    // 4. Validate start location and category
    const startLocation = await Location.findById(start_location);
    if (!startLocation) {
      return res
        .status(404)
        .json({ success: false, message: "Start location not found" });
    }

    const categories = await Category.findById(category);
    if (!categories) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // 5. Create new Tour document, add all uploaded image public_ids to galleryImages
    const newTour = new Tour({
      tour_id,
      tour_name,
      description,
      price,
      start_location,
      first_destination,
      second_destination,
      startDate,
      endDate,
      status,
      overview,
      category,
      limit,
      galleryImages: uploadedFiles, // all images uploaded
      admin: admin._id,
    });

    await newTour.save();

    // 6. Parse and save itineraries if provided
    let parsedItineraries = [];
    if (typeof itineraries === "string") {
      try {
        parsedItineraries = JSON.parse(itineraries);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON format for itineraries",
        });
      }
    } else {
      parsedItineraries = itineraries;
    }

    if (Array.isArray(parsedItineraries)) {
      for (const itinerary of parsedItineraries) {
        await createItineraryEntry({ ...itinerary, tour: newTour._id });
      }
    }

    // 7. Success response
    res.status(201).json({
      success: true,
      message: "Tour created successfully",
      tour: newTour,
    });
  } catch (error) {
    console.error("Create tour error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Display all tours

export const getAllTours = async (req, res) => {
  try {
    const now = new Date();

    // Step 1: Auto-close expired tours
    const result = await Tour.updateMany(
      {
        startDate: { $lte: now },
        status: { $nin: ["Close", "Full"] },
      },
      { $set: { status: "Close" } }
    );

    const baseUrl =
      process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;

    // Step 2: Fetch all tours
    const tours = await Tour.find()
      .populate("admin", "name email")
      .populate("start_location")
      .populate("first_destination")
      .populate("second_destination")
      .populate("category");

    // Step 3: Get all bookings and calculate total booked seats per tour
    const bookings = await Tourbooking.find();
    const bookingMap = new Map();

    bookings.forEach((booking) => {
      const tourId = booking.tourId?.toString();
      if (!tourId) return;

      const current = bookingMap.get(tourId) || 0;
      bookingMap.set(tourId, current + (booking.bookingSit || 0));
    });

    // Step 4: Enhance each tour with images, reviews, and booked seats
    const updatedTours = await Promise.all(
      tours.map(async (tour) => {
        const reviews = await Review.find({ tourId: tour._id });

        const averageRating =
          reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

        return {
          ...tour.toObject(),
          galleryImages: tour.galleryImages.map((img) => `${baseUrl}/${img}`),
          averageRating: parseFloat(averageRating.toFixed(1)),
          totalReviews: reviews.length,
          totalBookedSeats: bookingMap.get(tour._id.toString()) || 0,
        };
      })
    );

    res.status(200).json({
      success: true,
      updatedStatusCount: result.modifiedCount,
      count: updatedTours.length,
      tours: updatedTours,
    });
  } catch (error) {
    console.error("❌ Error in getAllTours:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Display a single tour
export const FiltersTour = async (req, res) => {
  try {
    const baseUrl =
      process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;

    const { minPrice, maxPrice } = req.query;

    const query = {};

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const tours = await Tour.find(query);

    if (!tours.length) {
      return res.status(404).json({
        success: false,
        message: "No tours found within the specified price range",
      });
    }

    const formattedTours = await Promise.all(
      tours.map(async (tour) => {
        const { averageRating, totalReviews } = await getReviewsForTour(
          tour._id
        );

        return {
          ...tour.toObject(),
          galleryImages: tour.galleryImages.map(
            (image) => `${baseUrl}/${image}`
          ),
          averageRating,
          totalReviews,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: formattedTours.length,
      tours: formattedTours,
    });
  } catch (error) {
    console.error("Error filtering tours:", error);
    res.status(500).json({
      success: false,
      message: "Server error while filtering tours",
    });
  }
};

//Filters tour max participants
export const TourmaxParticipants = async (req, res) => {
  try {
    const { maxParticipants, price } = req.query;

    const query = {};

    if (maxParticipants) {
      const max = parseInt(maxParticipants);
      if (isNaN(max)) {
        return res.status(400).json({
          success: false,
          message: "Invalid maxParticipants value",
        });
      }
      query.maxParticipants = { $lte: max };
    }

    if (price) {
      const maxPrice = parseFloat(price);
      if (isNaN(maxPrice)) {
        return res.status(400).json({
          success: false,
          message: "Invalid price value",
        });
      }
      query.price = { $lte: maxPrice };
    }

    const tours = await Tour.find(query);

    res.status(200).json({
      success: true,
      count: tours.length,
      tours,
    });
  } catch (error) {
    console.error("Error filtering tours:", error);
    res.status(500).json({
      success: false,
      message: "Server error while filtering tours",
    });
  }
};

//Filters toour with day
export const duration = async (req, res) => {
  try {
    const { duration } = req.query;

    if (!duration || isNaN(parseInt(duration))) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid duration in days to filter",
      });
    }

    const targetDays = parseInt(duration);
    // Use lean() to get plain JavaScript objects without Mongoose-specific methods
    const allTours = await Tour.find().lean();

    const filteredTours = allTours.filter((tour) => {
      if (!tour.startDate || !tour.endDate) return false;

      const start = new Date(tour.startDate);
      const end = new Date(tour.endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;

      const days = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );

      return days === targetDays;
    });

    if (filteredTours.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tours found with the specified duration",
      });
    }

    const formattedTours = await Promise.all(
      filteredTours.map((tour) => formatTour(tour, req))
    );

    res.status(200).json({
      success: true,
      count: formattedTours.length,
      tours: formattedTours,
    });
  } catch (error) {
    console.error("Error filtering tours by duration:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while filtering tours",
      error: error.message,
    });
  }
};

export const ratings = async (req, res) => {
  try {
    const { rating } = req.query;

    if (!rating || isNaN(parseFloat(rating))) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid rating value to filter",
      });
    }

    const targetRating = parseFloat(parseFloat(rating).toFixed(1));
    const tolerance = 1;

    const allTours = await Tour.find().lean();
    const toursWithRatings = [];

    for (const tour of allTours) {
      const { averageRating, totalReviews } = await getReviewsForTour(tour._id);

      console.log(
        `Tour: ${tour.name || tour._id} | Avg Rating: ${averageRating}`
      );

      if (
        averageRating >= targetRating - tolerance &&
        averageRating < targetRating + tolerance
      ) {
        toursWithRatings.push({
          ...tour,
          averageRating,
          totalReviews,
        });
      }
    }

    if (toursWithRatings.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No tours found with an average rating around ${targetRating}`,
      });
    }

    const formattedTours = await Promise.all(
      toursWithRatings.map((tour) => formatTour(tour, req))
    );

    res.status(200).json({
      success: true,
      count: formattedTours.length,
      tours: formattedTours,
    });
  } catch (error) {
    console.error("Error retrieving ratings for tours:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving ratings for tours",
      error: error.message,
    });
  }
};

// Filter tours by location(s) and date range

export const filterToursByLocationAndDate = async (req, res) => {
  try {
    const { location, startDate, endDate } = req.query;

    if (!location || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Location, startDate, and endDate are required",
      });
    }

    // 1. Match exact location from DB
    const matchedLocations = await Location.find({
      $or: [
        { name: { $regex: `^${location}$`, $options: "i" } },
        { slug: { $regex: `^${location}$`, $options: "i" } },
      ],
    });

    const matchedLocationIds = matchedLocations.map((loc) => loc._id);

    if (!matchedLocationIds.length) {
      return res.status(404).json({
        success: false,
        message: "No tours found for the given location",
      });
    }

    // 2. Build strict query requiring all conditions
    const query = {
      $and: [
        {
          $or: [
            { start_location: { $in: matchedLocationIds } },
            { first_destination: { $in: matchedLocationIds } },
            { second_destination: { $in: matchedLocationIds } },
          ],
        },
        { startDate: { $gte: new Date(startDate) } },
        { endDate: { $lte: new Date(endDate) } },
      ],
    };

    // 3. Find matching tours
    const tours = await Tour.find(query)
      .populate("start_location", "name slug")
      .populate("first_destination", "name slug")
      .populate("second_destination", "name slug")
      .populate("category")
      .populate("admin", "name email");

    if (!tours.length) {
      return res.status(404).json({
        success: false,
        message: "No tours found for the given location and date range",
      });
    }

    const baseUrl =
      process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;

    const formattedTours = await Promise.all(
      tours.map(async (tour) => {
        const { averageRating, totalReviews } = await getReviewsForTour(
          tour._id
        );

        return {
          ...tour.toObject(),
          galleryImages: tour.galleryImages.map(
            (image) => `${baseUrl}/${image}`
          ),
          averageRating,
          totalReviews,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: formattedTours.length,
      tours: formattedTours,
    });
  } catch (error) {
    console.error("Error filtering tours:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while filtering tours",
      error: error.message,
    });
  }
};

//fucntion create averagating
// export const getReviewsForTour = async (tourId) => {
//   const reviews = await Review.find({ tourId });

//   const averageRating = reviews.length
//     ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
//     : 0;

//   return {
//     reviews,
//     averageRating: parseFloat(averageRating.toFixed(1)),
//     totalReviews: reviews.length,
//   };
// };

export const checkTourId = async (req, res) => {
  const { tour_id } = req.query;

  // Validate the tour_id
  if (!tour_id || typeof tour_id !== "string" || tour_id.trim().length === 0) {
    return res.status(400).json({ error: "Valid tour_id is required" });
  }

  try {
    // Check if tour_id exists in the database
    const exists = await Tour.findOne({ tour_id: tour_id.trim() });

    if (exists) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (err) {
    console.error("Error checking tour_id:", err); // Log the error for debugging
    res.status(500).json({ error: "Server error, please try again later" });
  }
};

export const updateTour = async (req, res) => {
  const { tourId } = req.params;

  try {
    const {
      tour_name,
      description,
      price,
      start_location,
      first_destination,
      second_destination,
      startDate,
      endDate,
      status,
      overview,
      category, // category name or slug
      limit,
      itineraries,
    } = req.body;

    const existingTour = await Tour.findById(tourId);
    if (!existingTour) {
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
    }

    // Step 1: Collect only non-empty location inputs
    const locationInputs = [
      start_location,
      first_destination,
      second_destination,
    ].filter(Boolean);

    // Step 2: Fetch matching locations from DB
    const foundLocations = await Location.find({
      $or: [
        { name: { $in: locationInputs } },
        {
          _id: {
            $in: locationInputs.filter((val) => /^[a-f\d]{24}$/i.test(val)),
          },
        },
      ],
    });

    // Step 3: Create a lookup map
    const locationMap = {};
    foundLocations.forEach((loc) => {
      locationMap[loc._id.toString()] = loc._id;
      locationMap[loc.name] = loc._id;
    });

    // ✅ Resolve category ID by name or slug
    let categoryId = existingTour.category;
    if (category) {
      const foundCategory = await Category.findOne({
        $or: [{ name: category }, { slug: category }],
      });
      if (foundCategory) {
        categoryId = foundCategory._id;
      }
    }

    // ✅ Update tour fields
    if (tour_name !== undefined) existingTour.tour_name = tour_name;
    if (description !== undefined) existingTour.description = description;
    if (price !== undefined) existingTour.price = price;

    // Step 4: Conditionally update fields
    if (start_location) {
      existingTour.start_location =
        locationMap[start_location] || start_location;
    }

    if (first_destination) {
      existingTour.first_destination =
        locationMap[first_destination] || first_destination;
    }

    if (second_destination) {
      existingTour.second_destination =
        locationMap[second_destination] || second_destination;
    }

    if (startDate !== undefined) existingTour.startDate = startDate;
    if (endDate !== undefined) existingTour.endDate = endDate;
    if (status !== undefined) existingTour.status = status;
    if (overview !== undefined) existingTour.overview = overview;
    if (limit !== undefined) existingTour.limit = limit;
    if (categoryId) existingTour.category = categoryId;

    await existingTour.save();

    // ✅ Update itineraries if provided
    let parsedItineraries = [];
    if (itineraries) {
      parsedItineraries =
        typeof itineraries === "string" ? JSON.parse(itineraries) : itineraries;

      if (Array.isArray(parsedItineraries) && parsedItineraries.length > 0) {
        await Itinerary.deleteMany({ tour: existingTour._id });
        for (const itinerary of parsedItineraries) {
          await createItineraryEntry({ ...itinerary, tour: existingTour._id });
        }
      }
    }

    const populatedTour = await Tour.findById(existingTour._id)
      .populate("start_location", "name")
      .populate("first_destination", "name")
      .populate("second_destination", "name")
      .populate("category", "name slug");

    const updatedItineraries = await Itinerary.find({ tour: existingTour._id });

    res.status(200).json({
      success: true,
      message: "Tour updated successfully",
      tour: populatedTour,
      parsedItinerarie: updatedItineraries,
    });
  } catch (error) {
    console.error("Update Tour Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTour = async (req, res) => {
  try {
    const { tourId, fileName } = req.params; // Extract tourId and optional fileName from the URL parameters

    // Find the tour by its ID
    const tour = await Tour.findById(tourId);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    // If fileName is provided, delete that specific image
    if (fileName) {
      if (tour.galleryImages.includes(fileName)) {
        // Remove the image from the gallery
        tour.galleryImages = tour.galleryImages.filter(
          (image) => image !== fileName
        );

        // Optionally delete the image file from the file system
        const imagePath = `./uploads/tours/${fileName}`;
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath); // Delete the image file from the file system
        }

        await tour.save();
        return res.status(200).json({
          success: true,
          message: "Image deleted successfully from the tour",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Image not found in tour gallery",
        });
      }
    }

    // If no fileName is provided, delete all images in the gallery
    for (const image of tour.galleryImages) {
      const imagePath = `./uploads/tours/${image}`;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Delete each image file from the file system
      }
    }

    // Clear the galleryImages array
    tour.galleryImages = [];

    // Save the tour with the empty gallery
    await tour.save();

    // Delete all itineraries associated with the tour
    await Itinerary.deleteMany({ tour: tour._id });

    // Delete the tour from the database
    await Tour.deleteOne({ _id: tour._id });

    return res.status(200).json({
      success: true,
      message:
        "Tour, its gallery images, and associated itineraries deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
