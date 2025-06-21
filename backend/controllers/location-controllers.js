import Location from "../models/loaction-models.js";
import Tour from "../models/tour-models.js";

// CREATE
export const createLocation = async (req, res) => {
  try {
    const { name } = req.body;
    const location = new Location({ name });
    await location.save();
    res.status(201).json(location);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ ALL
export const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE
export const getLocationBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const location = await Location.findOne({ slug });
    if (!location) return res.status(404).json({ error: "Location not found" });
    res.status(200).json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateLocation = async (req, res) => {
  try {
    const { slug } = req.params;
    const { name } = req.body;
    const location = await Location.findOne({ slug });
    if (!location) return res.status(404).json({ error: "Location not found" });

    location.name = name;
    await location.save();
    res.status(200).json(location);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
export const deleteLocation = async (req, res) => {
  try {
    const { slug } = req.params;
    const location = await Location.findOneAndDelete({ slug });
    if (!location) return res.status(404).json({ error: "Location not found" });
    res.status(200).json({ message: "Location deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// By id
export const byIdLocation = async (req, res) => {
  const { locId } = req.params; // Fixed typo (loactionId -> locationId)

  try {
    // Attempt to find the location by ID
    const location = await Location.findById(locId);

    // If no location is found, return a 404 error
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    // Return the found location
    res.status(200).json(location);
  } catch (error) {
    // If there's an error with the query, return a 400 error
    res.status(400).json({ error: error.message }); // Use error instead of err
  }
};

export const getTourWithLocations = async (req, res) => {
  try {
    const tourId = req.params.id;

    // Populate all three referenced locations
    const tour = await Tour.findById(tourId)
      .populate("start_location")
      .populate("first_destination")
      .populate("second_destination");

    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    res.status(200).json({ tour });
  } catch (error) {
    console.error("Error fetching tour with populated locations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
