import { User } from "../models/user-models.js";

export const verifyAdmin = async (req, res, next) => {
  try {
    const { id } = req.params; // Extract the user ID from request parameters

    // Fetch user from the database
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user is an admin
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    req.user = user; // Store user info in request object for later use
    next(); // User is an admin, proceed to the next middleware
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
