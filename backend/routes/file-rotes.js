import express from "express";

const filerouter = express.Router();
import {
  deleteUser,
  getProfileImage,
  getAllUsers,
  getUserById,
  handleUpqload,
  updateUserProfile,
  uploadProfileImage,
  uploadMultipleFiles,
  getGallery,
  getGallerys,
  uploadMultipleFilesNot,
  deleteGallery,
} from "../controllers/file-controllers.js";
import { singleUpload, uploadMultiple } from "../middlewares/upload.js";

import { verifyAdmin } from "../middlewares/adminVerify.js";

filerouter.get("/profile/:id", verifyAdmin, getAllUsers);

filerouter.post("/single-upload", singleUpload, handleUpqload);

//upload multiple files by admin id (Protected)

filerouter.post(
  "/admin/:id/upload/:tourId",
  verifyAdmin, // 1. Authorization
  uploadMultiple, // 2. Upload middleware
  uploadMultipleFiles // 3. Final controller
);

//upload multiple files by user
filerouter.post("/admin/:id/upload", uploadMultiple, uploadMultipleFilesNot);

filerouter.delete("/:tourId/:fileName", deleteGallery);

filerouter.get("/gallery", getGallerys);
filerouter.get("/galleryid/:tourId", getGallery);

filerouter.get("/admin/:adminId/tour/:tourId", getGallery);
filerouter.post("/upload-profile/:id", uploadProfileImage);

filerouter.get("/profile-image/:id", getProfileImage);

// Get User Profile (Protected)
filerouter.get("/profile/:id", getUserById);

filerouter.delete("/delete-profile/:id", deleteUser);

// Update User Profile (Protected)
filerouter.put("/update-profile/:id", updateUserProfile);

export default filerouter;
