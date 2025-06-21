import { createItineraryEntry } from "../services/itineraryService.js";
import { Itinerary } from "../models/itinerary-models.js";

export const createItinerary = async (req, res) => {
  try {
    const newItinerary = await createItineraryEntry(req.body);
    res.status(201).json({
      message: "Itinerary created successfully",
      itinerary: newItinerary,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating itinerary", error });
  }
};

// Function to get all itineraries by tour ID
export const getItinerariesByTourId = async (req, res) => {
  const { tourId } = req.params;

  if (!tourId) {
    return res.status(400).json({ message: "tourId is required" });
  }

  try {
    const itineraries = await Itinerary.find({ tour: tourId });
    res.status(200).json({ itineraries });
  } catch (error) {
    res.status(500).json({ message: "Error fetching itineraries", error });
  }
};
