import multer from "multer";
import path from "path";
import cloudinary from "../utils/cloudinaryConfig.js";
// import { v2 as cloudinary } from "cloudinary.js";
import fs from "fs";

// Function to check allowed file types
function checkFileType(file, cb) {
  const filetypes =
    /jpeg|jpg|png|gif|webp|svg|bmp|pdf|doc|docx|xls|xlsx|ppt|pptx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Images only!"));
  }
}

// Storage for profile uploads

const profileStorage = multer.diskStorage({
  destination: "./uploads/profile",
  filename: (req, file, cb) => {
    const filename = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});

// Storage for tour uploads
const tourStorage = multer.diskStorage({
  destination: "tours",
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Middleware for single file upload (Profile)
export const singleUpload = multer({
  storage: profileStorage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB limit
  fileFilter: (req, file, cb) => checkFileType(file, cb),
}).single("file");

export const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "profiles",
    });

    fs.unlink(filePath, (err) => {
      if (err) console.error("❌ Failed to delete local file:", err);
      else console.log("🧹 Deleted local file:", filePath);
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error);
    throw error;
  }
};

// Delete Cloudinary image by public_id
export const deleteFromCloudinary = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    console.log("🗑️ Cloudinary image deleted:", result);
    return result;
  } catch (error) {
    console.error("❌ Cloudinary deletion failed:", error);
    throw error;
  }
};



// Improved storage configuration
export const customTourStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "tours";
    fs.mkdirSync(uploadPath, { recursive: true }); // recursive: true makes existsSync check unnecessary
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
    cb(null, uniqueName);
  },
});

// Multer instance with proper error handling
export const uploadMultiple = multer({
  storage: customTourStorage, // Fixed variable name
  fileFilter: (req, file, cb) => checkFileType(file, cb),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
}).array("files", 40); // Max 40 files
