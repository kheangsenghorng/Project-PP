import express from "express";
import {
  signup,
  verifyEmail,
  checkAuth,
  login,
  logout,
  forgotPassword,
  resetPassword,
  deleteUser,
  editUser,
  showGoogleAuth,
  handleGoogle,
  showFacebookAuth,
  handleFacebook,
} from "../controllers/auth-controllers.js";
import {
  getAllUsers,
  getbyIdadmin,
  getUserById,
} from "../controllers/display-user-controllers.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { verifyAdmin } from "../middlewares/adminVerify.js";
// import upload from "../middleware/uploadImage.js";

const router = express.Router();

// // Route to get all users
router.post("/signup", signup);

// // Route to get a user by ID
router.post("/login", login);

router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);

router.post("/verify-email", verifyEmail);

router.post("/reset-password/:token", resetPassword);
// router.get("/profile", verifyToken, getProfile);
// router.get("/users", verifyToken, getUsersByRole);
router.get("/google", showGoogleAuth);
router.get("/callback/google", handleGoogle);

router.get("/facebook", showFacebookAuth); // Redirect to Facebook
router.get("/facebook/callback", handleFacebook); // Handle Facebook response

// // Route to edit a user
router.put("/users/:userId", editUser); // Use PUT to edit

//id admin display all users
router.get("/:id/users", getAllUsers);

// // Route to get a user by ID
router.get("/users/:id", getUserById);
// router.get("/users/:id", companyUser);

// // Route to get a user by ID
router.get("/:id/:userId/users", verifyAdmin, getbyIdadmin);

// // Delete user route
router.delete("/users/:id", deleteUser); // Use D ELETE to remove

// // router.put("/profile", verifyToken, updateProfile);

router.get("/check-auth", verifyToken, checkAuth);
export default router;
