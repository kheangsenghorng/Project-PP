import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: false,
    },
    bookingDate: {
      type: Date,
      default: Date.now, // Automatically set current date if not provided
    },
  },
  { timestamps: true }
);

export const Review = mongoose.model("Review", reviewSchema);
