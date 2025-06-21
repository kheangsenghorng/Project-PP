import { InfoItem } from "../models/additional-models.js"; // Adjust path as needed

// Get all info items for a specific tour
export const getInfoItemsByTour = async (req, res) => {
  const { tourId } = req.params;
  try {
    const items = await InfoItem.find({ tourId });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch info items", error: err });
  }
};

// Create a new info item
export const createInfoItem = async (req, res) => {
  const { id: tourId } = req.params; // extract tourId from route
  const { text } = req.body;

  try {
    const newItem = new InfoItem({ tourId, text });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: "Failed to create info item", error: err });
  }
};

// Update an info item
export const updateInfoItem = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  try {
    const updatedItem = await InfoItem.findByIdAndUpdate(
      id,
      { text },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "Info item not found" });
    }
    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: "Failed to update info item", error: err });
  }
};

// Delete an info item
export const deleteInfoItem = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedItem = await InfoItem.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Info item not found" });
    }
    res.status(200).json({ message: "Info item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete info item", error: err });
  }
};
