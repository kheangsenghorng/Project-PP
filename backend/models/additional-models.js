import mongoose from "mongoose";

// Define the schema for Additional Info Item
const infoItemSchema = new mongoose.Schema({
  tourId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tour",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

// Create a model from the schema
export const InfoItem = mongoose.model("InfoItem", infoItemSchema);
