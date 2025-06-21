import express from "express";
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReviewsByTourId,
  getreviewsUser,
  getAllTopRatedReviews,
} from "../controllers/review-controllers.js";
import { verifyAdmin } from "../middlewares/adminVerify.js";

const router = express.Router();

// POST /api/reviews - Create review
router.post("/:tourId/:userId/review", createReview);

//display all reviews by admin
// This route is protected by the verifyAdmin middleware
router.get("/:id/:tourId", verifyAdmin, getReviewsByTourId);
// GET /api/reviews - Get all reviews
router.get("/", getAllReviews);
router.get("/topRated", getAllTopRatedReviews);
// GET /api/reviews/tour/:tourId - Get reviews by tour
router.get("/:tourId", getReviewsByTourId);

// GET /api/reviews/user/:userId - Get reviews by user
router.get("/:userId/user/reviews", getreviewsUser);

// router.get("/:tourId/tour", getReviewsByTour);

// DELETE /api/reviews/:id - Delete review by ID
router.delete("/:id", deleteReview);

export default router;
