import mongoose from "mongoose";

const tourHistorybookingSchema = new mongoose.Schema({
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
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  bookingId: {
    type: String,
    required: true,
    unique: true, // Ensure bookingId is unique
    trim: true,
  },
  total: {
    type: Number,
    required: true,
  },
  sit: {
    type: Number,
    required: true,
  },
  date: {
    type: [Date], // <-- this is the key part
    validate: {
      validator: function (val) {
        return val.length === 2; // Ensure array has exactly 2 dates
      },
      message: "Date array must include [startDate, endDate]",
    },
    required: true,
  },
  status: {
    type: String,
    enum: ["cancel", "complete", "pending"],
    default: "pending",
  },
});

export const TourHistorybooking = mongoose.model(
  "TourHistorybooking",
  tourHistorybookingSchema
);
