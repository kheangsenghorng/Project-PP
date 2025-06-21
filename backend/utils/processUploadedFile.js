import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const uploadTourImages = async (req) => {
  try {
    const uploadedFiles = [];

    if (!req.files || req.files.length === 0) {
      return {
        success: false,
        message: "No files uploaded",
        uploadedFiles: [],
      };
    }

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "tours",
      });
      uploadedFiles.push(result.public_id);

      // Clean up local file
      fs.unlinkSync(file.path);
    }

    return { success: true, uploadedFiles };
  } catch (error) {
    return { success: false, message: error.message, uploadedFiles: [] };
  }
};

export const deleteOldGalleryImages = async (oldImages) => {
  // Implement logic to delete the old images from your storage system (local filesystem, S3, etc.)
  for (const image of oldImages) {
    // Example: Delete image from the file system
    try {
      await fs.promises.unlink(`./uploads/${image}`);
    } catch (error) {
      console.error(`Error deleting image: ${image}`, error);
    }
  }
};
