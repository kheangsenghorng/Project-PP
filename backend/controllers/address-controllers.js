import { Address } from "../models/address-user.js";
import { User } from "../models/user-models.js";

// Create Address
export const createAddress = async (req, res) => {
  const { id } = req.params; // Extract user ID from params
  try {
    const user = await User.findById(id);
    const address = new Address({ ...req.body, userId: id }); // Assign userId to the address
    await address.save();
    res.status(201).json({
      success: true,
      data: {
        user: user,
        address,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get Single Address
export const getAddressById = async (req, res) => {
  try {
    const address = await Address.findOne({ userId: req.params.id });
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }
    res.status(200).json({
      success: true,
      data: {
        address,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Address
export const updateAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndUpdate(
      { userId: req.params.id }, // Find address by userId
      req.body, // Update with new data
      { new: true } // Return the updated document
    );

    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    res.status(200).json({ success: true, data: address });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Address
export const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({ userId: req.params.id });
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Address by Admin

export const getAddressByIdAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    // Find all users except the one with the given ID
    const users = await User.find({ _id: { $ne: id } });
    const userCount = users.length;

    // Find one address that does not belong to the given user
    const address = await Address.findOne({ userId: { $ne: id } });
    const addressCount = address ? 1 : 0;

    res.status(200).json({
      success: true,
      message: "Data retrieved successfully.",
      data: {
        userCount,
        addressCount,
        users,
        address,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
