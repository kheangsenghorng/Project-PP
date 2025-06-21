// services/itineraryService.js
import { Itinerary } from "../models/itinerary-models.js";

export const createItineraryEntry = async (itineraryData) => {
  const { name, description, date, startTime, endTime, tour } = itineraryData;

  const newItinerary = new Itinerary({
    name,
    description,
    date,
    startTime,
    endTime,
    tour,
  });

  await newItinerary.save();
  return newItinerary;
};
