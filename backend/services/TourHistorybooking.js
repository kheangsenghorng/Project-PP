import { TourHistorybooking } from "../models/tour-history_bookings.js";
import Tour from "../models/tour-models.js";

export const createTourHistoryBooking = async (bookingData) => {
  const { tourId, userId, bookingDate, status, total, sit } = bookingData;
  const currentYear = new Date().getFullYear();

  const tour = await Tour.findById(tourId);

  if (!tour) {
    throw new Error("Tour not found");
  }

  // Find the last booking ID that matches the format "BK-<YEAR>-XXXX"
  const lastBooking = await TourHistorybooking.findOne({
    bookingId: { $regex: `^BK-${currentYear}-\\d{4}$` },
  })
    .sort({ bookingId: -1 })
    .select("bookingId");

  let newNumericId = 1;

  if (lastBooking?.bookingId) {
    const match = lastBooking.bookingId.match(/^BK-\d{4}-(\d{4})$/);
    if (match?.[1]) {
      newNumericId = parseInt(match[1], 10) + 1;
    }
  }

  const bookingId = `BK-${currentYear}-${String(newNumericId).padStart(4, "0")}`;

  const newBooking = new TourHistorybooking({
    tourId,
    userId,
    total,
    sit,
    date: [tour.startDate, tour.endDate],
    bookingDate,
    bookingId,
    status,
  });

  await newBooking.save();
  return newBooking;
};

export const getTourHistoryBookings = async (userId) => {
  return await TourHistorybooking.find({ userId }).populate("tourId");
};
