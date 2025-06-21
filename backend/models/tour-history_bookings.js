import mongoose from "mongoose";

const tourHistorybookingSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ["cancel", "complete", "pending"],
      default: "pending",
    },  
  },
  { timestamps: true }
);

export const TourHistorybooking = mongoose.model(
  "TourHistorybooking",
  tourHistorybookingSchema
);
