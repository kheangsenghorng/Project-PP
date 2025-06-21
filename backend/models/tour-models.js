import mongoose from "mongoose";

const tourSchema = new mongoose.Schema({
  tour_id: { type: String, required: true, unique: true },
  tour_name: { type: String, required: true }, // Name of the tour
  description: { type: String, required: true }, // Description of the tour
  price: { type: Number, required: true }, // Price of the tour
  start_location: {
    type: mongoose.Types.ObjectId,
    ref: "Location", // Reference to Location model
    required: true,
  }, // Starting location for the tour
  first_destination: {
    type: mongoose.Types.ObjectId,
    ref: "Location", // Reference to Location model
    required: false,
  }, // First destination
  second_destination: {
    type: mongoose.Types.ObjectId,
    ref: "Location", // Reference to Location model
    required: false,
  }, // Second destination (optional)
  startDate: { type: Date, required: true }, // Start date for the tour
  endDate: { type: Date, required: true }, // End date for the tour
  status: {
    type: String,
    enum: ["Ongoing", "Full", "Close"], // Only allows one of these values
    default: "Ongoing", // Default value if not provided
  },
  specialStatus: {
    type: String,
    enum: ["Sold Out", "Special Offer"], // Optional status
    default: "Special Offer", // Default value if not provided
  },
  overview: { type: String, required: false }, // Tour overview (optional)
  category: {
    type: mongoose.Types.ObjectId,
    ref: "Category", // Reference to Category model
    required: true,
  },
  limit: { type: Number, required: true }, // Maximum number of people allowed
  // Accommodation is stored as a string of binary digits
  accommodation: {
    type: String,
    default: "0000000000", // Default to all "No" accommodations
  },
  galleryImages: { type: [String], default: [] },
  admin: {
    type: mongoose.Types.ObjectId,
    ref: "User", // Reference to the User model (company)
    default: null,
  },
});

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
