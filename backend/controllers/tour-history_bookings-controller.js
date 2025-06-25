import { TourHistorybooking } from "../models/tour-history_bookings.js";

export const getTourHistoryBookings = async (req, res) => {
  const { userId } = req.params;
  try {
    const bookings = await TourHistorybooking.find({ userId }).populate(
      "tourId"
    );
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching tour history bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
