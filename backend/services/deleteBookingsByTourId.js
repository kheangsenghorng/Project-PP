import { Tourbooking } from "../models/tour-booking-models.js";

export const deleteBookingsByTourId = async (tourId) => {
  try {
    const result = await Tourbooking.deleteMany({ tourId });
    console.log(`Deleted ${result.deletedCount} bookings for tour ${tourId}`);
    return result;
  } catch (error) {
    console.error("Error deleting bookings:", error);
    throw error;
  }
};
