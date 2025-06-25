import express from "express";
import { getTourHistoryBookings } from "../controllers/tour-history_bookings-controller.js";

const router = express.Router();
// Route to create a new tour history booking
router.get("/:userId", getTourHistoryBookings);

export default router;
