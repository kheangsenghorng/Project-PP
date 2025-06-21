import express from "express";
import {
  createTourBooking,
  deleteTourBooking,
  getAllBookingsIdUser,
  getAllTourBookings,
  getTourBookingById,
  getTourBookingsByTourAndUser,
  getTourBookingsByTourId,
  getTourBookingsByUserId,
  getUserPastTours,
  updateTourBooking,
} from "../controllers/booking-controller.js";
import { verifyAdmin } from "../middlewares/adminVerify.js";

const router = express.Router();

router.post("/tour/:tourId/user/:userId", createTourBooking);
router.get("/admin/:id/tour/:tourId", verifyAdmin, getTourBookingsByTourId);
router.get("/user/:userId", getTourBookingsByUserId);

router.get("/by-user/:userId/tour/:tourId", getTourBookingsByTourAndUser);

router.get("/user/:userId/booked-tours", getUserPastTours);

router.get("/by-user/:userId", getAllBookingsIdUser);
router.get("/", getAllTourBookings);
router.get("/:id", getTourBookingById);
router.put("/:id", updateTourBooking);
router.delete("/:id", deleteTourBooking);

export default router;
