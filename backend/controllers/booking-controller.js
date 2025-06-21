import { Tourbooking } from "../models/tour-booking-models.js";
import Tour from "../models/tour-models.js";
import { Review } from "../models/review-models.js";

export const createTourBooking = async (req, res) => {
  try {
    const { tourId, userId } = req.params;
    const { bookingSit, bookingTotal, bookingStatus } = req.body;

    // 1. Get the tour info
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    // 2. Get current total booked seats
    const existingBookings = await Tourbooking.find({ tourId });
    const totalBookedSeats = existingBookings.reduce(
      (sum, booking) => sum + (booking.bookingSit || 0),
      0
    );

    // 3. Check seat availability
    if (totalBookedSeats + bookingSit > tour.limit) {
      return res.status(400).json({
        message: `Not enough seats available. Only ${
          tour.limit - totalBookedSeats
        } left.`,
      });
    }

    // 4. Save new booking
    const newBooking = new Tourbooking({
      tourId,
      userId,
      bookingSit,
      bookingTotal,
      bookingStatus,
    });

    const savedBooking = await newBooking.save();

    // 5. Update tour status to "Full" if limit reached
    const updatedTotalSeats = totalBookedSeats + bookingSit;
    if (updatedTotalSeats >= tour.limit) {
      tour.status = "Full";
      await tour.save();
    }

    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ message: "Failed to create booking", error });
  }
};

// export const getAllTourBookings = async (req, res) => {
//   try {
//     const bookings = await Tourbooking.find()
//       .populate("tourId")
//       .populate("userId");

//     const bookingMap = new Map();

//     bookings.forEach((booking) => {
//       const tour = booking.tourId;
//       const tourId = tour?._id?.toString();
//       if (!tourId) return;

//       const existing = bookingMap.get(tourId) || {
//         tourId,
//         tourName: tour.tour_name,
//         totalBookedSeats: 0,
//         totalBookings: 0,
//       };

//       existing.totalBookedSeats += booking.bookingSit || 0;
//       existing.totalBookings += 1;

//       bookingMap.set(tourId, existing);
//     });

//     const tourSeatCounts = Array.from(bookingMap.values());

//     res.status(200).json({
//       totalBookings: bookings.length, // total number of booking records
//       bookings,
//       tourSeatCounts,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch bookings", error });
//   }
// };

// Get all bookings by Tour ID
// export const getTourBookingsByTourId = async (req, res) => {
//   try {
//     const { tourId } = req.params;

//     const bookings = await Tourbooking.find({ tourId }).populate("userId");

//     if (bookings.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No bookings found for this tour" });
//     }

//     const baseUrl = process.env.BASE_URL;

//     const bookingsWithUserImages = bookings.map((booking) => {
//       const user = booking.userId;

//       const profile_image = user?.profile_image
//         ? `${baseUrl}/uploads/profile/${user.profile_image}`
//         : null;

//       return {
//         ...booking._doc,
//         userId: {
//           ...user._doc,
//           profile_image,
//         },
//       };
//     });

//     res.status(200).json(bookingsWithUserImages);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch bookings", error });
//   }
// };
export const getAllTourBookings = async (req, res) => {
  try {
    const bookings = await Tourbooking.find()
      .populate("tourId")
      .populate("userId");

    const bookingMap = new Map();
    const uniqueUserIds = new Set();
    const uniqueTourIds = new Set();

    bookings.forEach((booking) => {
      const tour = booking.tourId;
      const user = booking.userId;
      const tourId = tour?._id?.toString();
      const userId = user?._id?.toString();
      if (!tourId || !userId) return;

      // For global unique counts
      uniqueUserIds.add(userId);
      uniqueTourIds.add(tourId);

      const key = tourId;
      const existing = bookingMap.get(key) || {
        tourId,
        tourName: tour.tour_name,
        totalBookedSeats: 0,
        uniqueUsers: new Set(),
      };

      existing.totalBookedSeats += booking.bookingSit || 0;
      existing.uniqueUsers.add(userId);

      bookingMap.set(key, existing);
    });

    // Convert Set of users to count
    const tourSeatCounts = Array.from(bookingMap.values()).map((item) => ({
      tourId: item.tourId,
      tourName: item.tourName,
      totalBookedSeats: item.totalBookedSeats,
      totalUniqueUsers: item.uniqueUsers.size,
    }));

    res.status(200).json({
      totalUniqueBookings: uniqueUserIds.size, // total unique users
      totalToursBooked: uniqueTourIds.size, // total unique tours
      totalBookings: bookings.length,
      bookings,
      tourSeatCounts,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings", error });
  }
};

export const getTourBookingsByTourId = async (req, res) => {
  try {
    const { tourId } = req.params;
    const baseUrl = process.env.BASE_URL;

    // Fetch bookings and populate user data
    const rawBookings = await Tourbooking.find({ tourId })
      .populate("tourId")
      .populate("userId");

    if (rawBookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this tour" });
    }

    // Group bookings by userId
    const userBookingMap = new Map();

    rawBookings.forEach((booking) => {
      const user = booking.userId;
      const userId = user?._id.toString();

      const profile_image = user?.profile_image
        ? `${baseUrl}/${user.profile_image}`
        : null;

      if (!userBookingMap.has(userId)) {
        userBookingMap.set(userId, {
          userId: {
            ...user._doc,
            profile_image,
          },
          totalSit: booking.bookingSit,
          totalPrice: booking.bookingTotal,
          bookingCount: 1,
          bookings: [booking._doc],
        });
      } else {
        const existing = userBookingMap.get(userId);
        existing.totalSit += booking.bookingSit;
        existing.totalPrice += booking.bookingTotal;
        existing.bookingCount += 1;
        existing.bookings.push(booking._doc);
      }
    });

    const groupedBookings = Array.from(userBookingMap.values());

    res.status(200).json({
      totalUniqueUsers: groupedBookings.length,
      totalBookings: rawBookings.length,
      bookings: rawBookings, // flat array
      groupedBookings, // grouped by user
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings", error });
  }
};

export const getTourBookingsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const baseUrl = process.env.BASE_URL;

    const rawBookings = await Tourbooking.find({ userId })
      .populate({
        path: "tourId",
        populate: [
          { path: "start_location" },
          { path: "first_destination" },
          { path: "second_destination" },
          { path: "category" },
        ],
      })
      .populate("userId");

    if (!rawBookings.length) {
      return res
        .status(404)
        .json({ message: "No bookings found for this user" });
    }

    const tourBookingMap = new Map();

    rawBookings.forEach((booking) => {
      const tour = booking.tourId;
      const user = booking.userId;
      const tourId = tour?._id.toString();

      // Construct full profile image URL
      const profile_image = user?.profile_image
        ? `${baseUrl}/${user.profile_image}`
        : null;

      // Booking with user info and profile image
      const bookingData = {
        ...booking._doc,
        user: {
          ...user?._doc,
          profile_image,
        },
      };

      if (!tourBookingMap.has(tourId)) {
        tourBookingMap.set(tourId, {
          tourId: tour,
          galleryImages: Array.isArray(tour?.galleryImages)
            ? tour.galleryImages.map(
                (image) => `${baseUrl}/${image}`
              )
            : [],
          totalSit: booking.bookingSit,
          totalPrice: booking.bookingTotal,
          bookingCount: 1,
          bookings: [bookingData],
        });
      } else {
        const existing = tourBookingMap.get(tourId);
        existing.totalSit += booking.bookingSit;
        existing.totalPrice += booking.bookingTotal;
        existing.bookingCount += 1;
        existing.bookings.push(bookingData);
      }
    });

    const groupedBookings = Array.from(tourBookingMap.values());

    res.status(200).json({
      totalUniqueTours: groupedBookings.length,
      totalBookings: rawBookings.length,
      groupedBookings,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch bookings", error: error.message });
  }
};

export const getAllBookingsIdUser = async (req, res) => {
  const { userId } = req.params; // Assuming you pass userId as a route param
  const baseUrl = process.env.BASE_URL;
  try {
    const bookings = await Tourbooking.find({ userId }).populate("tourId");

    const bookingMap = new Map();

    // Enhance each booking with galleryImages URLs
    const enrichedBookings = bookings.map((booking) => {
      const tour = booking.tourId;

      // Sum bookingSit per tour
      const tourId = tour?._id?.toString();
      const currentTotal = bookingMap.get(tourId) || 0;
      bookingMap.set(tourId, currentTotal + (booking.bookingSit || 0));

      // Add galleryImages URLs
      const galleryImages = Array.isArray(tour?.galleryImages)
        ? tour.galleryImages.map((image) => `${baseUrl}/${image}`)
        : [];

      return {
        ...booking._doc, // Convert Mongoose document to plain object
        tourId: {
          ...tour._doc,
          galleryImages,
        },
      };
    });

    const totalSeats = Array.from(bookingMap.values()).reduce(
      (sum, seats) => sum + seats,
      0
    );

    res.status(200).json({
      bookings: enrichedBookings,
      totalSeats,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings", error });
  }
};

// Get single tour booking by ID
export const getTourBookingById = async (req, res) => {
  try {
    const booking = await Tourbooking.findById(req.params.id)
      .populate("tourId")
      .populate("userId");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch booking", error });
  }
};

// Update a tour booking
export const updateTourBooking = async (req, res) => {
  try {
    const updatedBooking = await Tourbooking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: "Failed to update booking", error });
  }
};

// Delete a tour booking
export const deleteTourBooking = async (req, res) => {
  try {
    const deletedBooking = await Tourbooking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete booking", error });
  }
};

export const getTourBookingsByTourAndUser = async (req, res) => {
  const { userId, tourId } = req.params;

  try {
    const baseUrl = process.env.BASE_URL;

    // Find bookings for this specific user and tour
    const bookings = await Tourbooking.find({ userId, tourId })
      .populate("tourId")
      .populate("userId");

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({
        message: "No bookings found for this user and tour",
      });
    }

    // Extract user info
    const user = bookings[0].userId;
    const profile_image = user?.profile_image
      ? `${baseUrl}/uploads/profile/${user.profile_image}`
      : null;

    // Attach galleryImages to each booking
    const bookingsWithGallery = bookings.map((b) => {
      const tour = b.tourId;
      const galleryImages = Array.isArray(tour?.galleryImages)
        ? tour.galleryImages.map((image) => `${baseUrl}/${image}`)
        : [];

      return {
        ...b._doc,
        galleryImages,
      };
    });

    // Aggregate totals
    const totalSit = bookings.reduce((sum, b) => sum + (b.bookingSit || 0), 0);
    const totalPrice = bookings.reduce(
      (sum, b) => sum + (b.bookingTotal || 0),
      0
    );

    res.status(200).json({
      tourId,
      userId,
      user: {
        ...user._doc,
        profile_image,
      },
      totalSit,
      totalPrice,
      bookingCount: bookings.length,
      bookings: bookingsWithGallery,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings", error });
  }
};

export const getUserPastTours = async (req, res) => {
  try {
    const userId = req.params.userId;
    const now = new Date();

    const baseUrl =
      process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;

    // Step 1: Get all bookings for the user
    const bookings = await Tourbooking.find({ userId }).populate({
      path: "tourId",
      populate: ["start_location", "first_destination", "second_destination"],
    });

    // Step 2: Filter for tours that have ended and collect unique tours (exclude already reviewed)
    const uniqueTourMap = new Map();

    for (const booking of bookings) {
      const tour = booking.tourId;
      if (!tour || !tour.endDate || new Date(tour.endDate) > now) continue;

      const tourId = tour._id.toString();

      // Check if the user has already reviewed this tour
      const alreadyReviewed = await Review.exists({ userId, tourId });
      if (alreadyReviewed) continue;

      if (!uniqueTourMap.has(tourId)) {
        // Format images if any
        const formattedImages = Array.isArray(tour.galleryImages)
          ? tour.galleryImages.map((img) => `${baseUrl}/${img}`)
          : [];

        uniqueTourMap.set(tourId, {
          bookingId: booking._id,
          tourId: tour._id,
          tourTitle: tour.title,
          price: tour.price,
          description: tour.description,
          overview: tour.overview,
          accommodation: tour.accommodation,
          tourEndDate: tour.endDate,
          specialStatus: tour.specialStatus,
          bookingSit: booking.bookingSit,
          status: tour.status,
          start_location: tour.start_location,
          first_destination: tour.first_destination,
          second_destination: tour.second_destination,
          galleryImages: formattedImages,
        });
      }
    }

    const endedTours = Array.from(uniqueTourMap.values());

    res.status(200).json({
      success: true,
      count: endedTours.length,
      tours: endedTours,
    });
  } catch (error) {
    console.error("❌ Error in getUserPastTours:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching past booked tours",
      error: error.message,
    });
  }
};
