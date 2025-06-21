import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { User } from "../models/user-models.js";
import Tour from "../models/tour-models.js";
import {
  deleteFromCloudinary,
  singleUpload,
  uploadToCloudinary,
} from "../middlewares/upload.js";
import { Itinerary } from "../models/itinerary-models.js";
import { Tourbooking } from "../models/tour-booking-models.js";
import cloudinary from "../utils/cloudinaryConfig.js";
// import { v2 as cloudinary } from "cloudinary.js";

export const handleUpqload = asyncHandler(async (req, res) => {
  //'send past in db
  console.log(req.file);
  return res.json(req.file);
});

// Upload Profile Image

// // Upload Profile Image
// export const uploadProfileImage = (req, res) => {
//   const { id } = req.params;
//   singleUpload(req, res, async (err) => {
//     if (err) return res.status(400).json({ message: err });

//     try {
//       const user = await User.findById(id);
//       if (!user) return res.status(404).json({ message: "User not found" });

//       // Delete old profile image if it exists
//       if (user.profile_image) {
//         const oldImagePath = path.join(
//           "./uploads/profile",
//           path.basename(user.profile_image)
//         );
//         if (fs.existsSync(oldImagePath)) {
//           fs.unlinkSync(oldImagePath);
//         }
//       }

//       user.profile_image = req.file.filename;
//       await user.save();

//       res.status(200).json({
//         message: "Profile image updated successfully",
//         profile_image: user.profile_image,
//       });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });
// };

function extractPublicIdFromUrl(url) {
  const parts = url.split("/upload/");
  if (parts.length < 2) return "";
  const pathWithVersionAndExtension = parts[1];
  const withoutVersion = pathWithVersionAndExtension.replace(/^v\d+\//, ""); // remove vXXXX/
  const publicId = withoutVersion.replace(/\.(jpg|jpeg|png|webp|gif|svg)$/, ""); // remove extension
  return publicId;
}

export const uploadProfileImage = (req, res) => {
  const { id } = req.params;

  singleUpload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    try {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const result = await uploadToCloudinary(req.file.path); // returns { url, public_id }

      // Extract public_id manually from the secure_url
      const extractedPublicId = extractPublicIdFromUrl(result.url);

      // Optional: delete old image
      if (user.profile_image) {
        await deleteFromCloudinary(user.profile_image);
      }

      // Save only extracted public_id
      user.profile_image = extractedPublicId;
      await user.save();

      res.status(200).json({
        message: "Profile image updated successfully",
        profile_image: user.profile_image, // ⬅️ only 'profiles/kwsoqnxxuczfma09bjnm'
      });
    } catch (error) {
      console.error("❌ Upload error:", error);
      res.status(500).json({ message: error.message });
    }
  });
};

// export const uploadProfileImage = (req, res) => {
//   const { id } = req.params;

//   singleUpload(req, res, async (err) => {
//     if (err) return res.status(400).json({ message: err.message });

//     try {
//       const user = await User.findById(id);
//       if (!user) return res.status(404).json({ message: "User not found" });

//       // Upload to Cloudinary
//       const result = await uploadToCloudinary(req.file.path);

//       // Delete old Cloudinary image if exists
//       if (user.profile_image_id) {
//         console.log(
//           "Deleting old profile image from Cloudinary:",
//           user.profile_image_id
//         );

//         await deleteFromCloudinary(user.profile_image_id);
//       }

//       // Save new image info
//       user.profile_image = result.url;
//       user.profile_image_id = result.public_id;
//       await user.save();

//       res.status(200).json({
//         message: "Profile image updated successfully",
//         profile_image: user.profile_image,
//       });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });
// };

// Upload multiple files for a tour by admin ID

export const uploadMultipleFiles = async (req, res) => {
  try {
    const { tourId, id } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    // ✅ Check if tour exists
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    const existingImages = new Set(tour.galleryImages);
    const uploadedPublicIds = [];
    const skippedFiles = [];

    for (const file of files) {
      // ✅ Upload and let Cloudinary assign unique ID
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "tours",
      });

      // Only store public_id like "tours/dxkflm3eojukubzn1xyc"
      const publicId = result.public_id;

      if (existingImages.has(publicId)) {
        skippedFiles.push(file.originalname);
        fs.unlinkSync(file.path);
        continue;
      }

      uploadedPublicIds.push(publicId);
      tour.galleryImages.push(publicId);

      fs.unlinkSync(file.path); // cleanup tmp file
    }

    await tour.save();

    const galleryImageUrls = tour.galleryImages.map((publicId) =>
      cloudinary.url(publicId, { secure: true })
    );

    return res.status(200).json({
      success: true,
      message: "Files uploaded to Cloudinary successfully",
      adminId: id,
      tourId: tour._id,
      totalUploaded: uploadedPublicIds.length,
      duplicatesSkipped: skippedFiles.length,
      skippedFiles,
      galleryImages: tour.galleryImages,
      galleryUrls: galleryImageUrls,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// For the non-tour version (if you want similar duplicate checking)
export const uploadMultipleFilesNot = async (req, res) => {
  try {
    const { id } = req.params; // Admin ID
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const uploadedFiles = files.map((file) => file.filename);
    const galleryImageUrls = uploadedFiles.map(
      (image) => `${req.protocol}://${req.get("host")}/uploads/tours/${image}`
    );

    res.status(200).json({
      success: true,
      message: "Files uploaded successfully",
      adminId: id,
      totalUploaded: uploadedFiles.length,
      galleryImages: uploadedFiles,
      galleryUrl: galleryImageUrls,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upload multiple files without checking for duplicates

// export const uploadMultipleFilesNot = async (req, res) => {
//   try {
//     const { id } = req.params; // Extract admin ID from URL
//     const files = req.files; // Get uploaded files

//     // Check if files were uploaded
//     if (!files || files.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "No files uploaded"
//       });
//     }

//     // Initialize an array to store filenames of uploaded files
//     const uploadedFiles = [];

//     // Check for duplicates
//     const existingFiles = fs.readdirSync('./uploads/tours'); // Read the existing files in the directory

//     const duplicateFiles = [];

//     files.forEach(file => {
//       if (existingFiles.includes(file.filename)) {
//         // If file already exists, add it to duplicateFiles array
//         duplicateFiles.push(file.filename);
//       } else {
//         // If no duplicate, add the file to uploadedFiles
//         uploadedFiles.push(file.filename);
//       }
//     });

//     // If there are any duplicate files, return an error message
//     if (duplicateFiles.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: `The following files already exist: ${duplicateFiles.join(', ')}`,
//         duplicateFiles, // Include the names of duplicate files
//       });
//     }

//     // Create URLs for the successfully uploaded files
//     const galleryImageUrls = uploadedFiles.map(
//       (image) => `${req.protocol}://${req.get("host")}/uploads/tours/${image}`
//     );

//     res.status(200).json({
//       success: true,
//       message: "Files uploaded successfully",
//       adminId: id,
//       totalUploaded: uploadedFiles.length,
//       galleryImages: uploadedFiles,
//       galleryUrls: galleryImageUrls, // Full URLs for images
//     });
//   } catch (error) {
//     // Generic error handling with a more informative message
//     console.error(error); // Optional, log error for debugging
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while uploading the files.",
//       error: error.message
//     });
//   }
// };

// Get all gallery images for a tour

export const getGalleryImages = async (req, res) => {
  try {
    const { tourId } = req.params;

    // Find the tour by ID
    const tour = await Tour.findById(tourId);
    if (!tour || !tour.galleryImages || tour.galleryImages.length === 0) {
      return res.status(404).json({ message: "No images found for this tour" });
    }

    // Generate full URLs for all images
    const galleryImageUrls = tour.galleryImages.map(
      (image) => `${req.protocol}://${req.get("host")}/${image}`
    );

    res.status(200).json({
      success: true,
      tourId: tour._id,
      totalImages: tour.galleryImages.length,
      galleryImages: tour.galleryImages, // The file names of the images
      galleryUrls: galleryImageUrls, // Image URLs for display
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getTourImage = async (req, res) => {
  const { tourId, imageName } = req.params;

  // Construct the image file path
  const tour = await Tour.findById(tourId);
  if (!tour) {
    return res.status(404).json({ success: false, message: "Tour not found" });
  }
  const imagePath = path.join(process.cwd(), "uploads", "tours", imageName);

  // Check if the file exists
  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ message: "Image file not found" });
  }

  // Send the image file as a response
  res.sendFile(imagePath);
};
// Serve all gallery images as URLs
// export const getGalleryImages = async (req, res) => {
//   try {
//     const { tourId } = req.params;

//     // Find the tour by ID
//     const tour = await Tour.findById(tourId);
//     if (!tour) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Tour not found" });
//     }

//     // Generate image URLs
//     const galleryImageUrls = tour.galleryImages.map(
//       (image) =>
//         `${req.protocol}://${req.get("host")}/api/upload/${tourId}/${image}`
//     );

//     res.status(200).json({
//       success: true,
//       tourId: tour._id,
//       totalImages: tour.galleryImages.length,
//       galleryImages: tour.galleryImages,
//       galleryUrl: galleryImageUrls,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const getProfileImage = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await User.findById(id);

//     if (!user || !user.profile_image) {
//       return res.status(404).json({ message: "Profile image not found" });
//     }

//     // Construct the absolute path to the image
//     const imagePath = path.join(
//       process.cwd(),
//       "uploads/profile",
//       user.profile_image
//     );

//     // Check if the file exists
//     if (!fs.existsSync(imagePath)) {
//       return res.status(404).json({ message: "Image file not found" });
//     }

//     // Send the image file directly as a response
//     res.sendFile(imagePath);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// };

export const getProfileImage = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user || !user.profile_image) {
      return res.status(404).json({ message: "Profile image not found" });
    }

    const imagePath = path.join(
      process.cwd(),
      "uploads/profile",
      user.profile_image
    );

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ message: "Image file not found" });
    }

    res.sendFile(imagePath);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Get All Users

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }); // Exclude admin users

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Map users to include full image URLs
    // const usersWithImages = users.map((user) => ({
    //   ...user._doc,
    //   profile_image_url: user.profile_image
    //     ? `${req.protocol}://${req.get("host")}/uploads/profile/${
    //         user.profile_image
    //       }`
    //     : null,
    // }));

    const baseUrl =
      process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
    const usersWithImages = users.map((user) => ({
      ...user._doc,
      profile_image_url: user.profile_image
        ? `${baseUrl}/${user.profile_image}`
        : null,
    }));

    res.status(200).json(usersWithImages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getProfileImageadmin = async (req, res) => {
  try {
    const { id } = req.params; // ID of the user whose profile image is being fetched
    // ID of the admin making the request (from authentication middleware)

    // Check if the user making the request is an admin
    const admin = await User.findById(id);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You must be an admin to perform this action.",
      });
    }

    // Find the user by ID
    const user = await User.findById(id);
    if (!user || !user.profile_image) {
      return res.status(404).json({ message: "Profile image not found" });
    }

    // Construct the image path
    const imagePath = path.join(
      process.cwd(),
      "uploads/profile",
      user.profile_image
    );

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ message: "Image file not found" });
    }

    // Serve the image file
    res.sendFile(imagePath);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password"); // Exclude password for security

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.firstname = req.body.firstname || user.firstname;
    user.lastname = req.body.lastname || user.lastname;
    user.phonenumber = req.body.phonenumber || user.phonenumber;

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete profile image if exists
    if (user.profile_image) {
      const imagePath = path.join(
        "./uploads/profile",
        path.basename(user.profile_image)
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//by id tour
export const getGallery = async (req, res) => {
  try {
    const { tourId } = req.params;

    // 1. Find the tour by ID and populate related fields
    const tour = await Tour.findById(tourId)
      .populate("start_location")
      .populate("first_destination")
      .populate("second_destination")
      .populate("category");

    if (!tour) {
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
    }

    // 2. Get base URL
    const baseUrl =
      process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;

    // 3. Map gallery image URLs
    const copiedTour = {
      ...tour.toObject(),
      galleryImages: tour.galleryImages.map((image) => `${baseUrl}/${image}`),
    };

    // 4. Find only bookings related to this tourId
    const bookings = await Tourbooking.find({ tourId });

    const totalSit = bookings.reduce(
      (sum, booking) => sum + (booking.bookingSit || 0),
      0
    );
    const totalPrice = totalSit * (tour.price || 0); // Assuming `tour.price` is per sit

    // 5. Get itineraries
    const itineraries = await Itinerary.find({ tour: tourId });

    // 6. Return response
    return res.status(200).json({
      success: true,
      tour: copiedTour,
      itineraries,
      totalSit,
      totalPrice,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getGallerys = async (req, res) => {
  try {
    // Fetch all tours from the database
    const tours = await Tour.find()
      .populate("start_location")
      .populate("first_destination")
      .populate("second_destination");

    if (!tours || tours.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No tours found" });
    }
    const count = tours.length;

    // Map through all tours and gather the gallery images
    const baseUrl =
      process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
    const allGalleryImages = tours.map((tour) => ({
      ...tour.toObject(), // Convert the Mongoose document to a plain object
      galleryImages: tour.galleryImages.map((image) => `${baseUrl}/${image}`),
    }));

    // Return all gallery images for all tours
    res.status(200).json({
      success: true,
      count,
      allGalleryImages: allGalleryImages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteGallery = async (req, res) => {
  try {
    const { tourId, fileName } = req.params;

    // Ensure the fileName exists and is safe
    if (!fileName || !tourId) {
      return res.status(400).json({
        success: false,
        message: "Tour ID and file name are required",
      });
    }

    // Prefix public_id with folder for Cloudinary
    const cloudinaryPublicId = `tours/${fileName}`;

    // Look up the tour and check for the image
    const tour = await Tour.findOne({
      _id: tourId,
      galleryImages: cloudinaryPublicId,
    });

    if (!tour) {
      return res.status(404).json({
        success: false,
        message:
          "Tour not found or image is not associated with this tour's gallery",
      });
    }

    // Remove the image from the galleryImages array
    tour.galleryImages = tour.galleryImages.filter(
      (image) => image !== cloudinaryPublicId
    );
    await tour.save();

    // Attempt to delete the image from Cloudinary
    const result = await cloudinary.uploader.destroy(cloudinaryPublicId);

    if (result.result !== "ok") {
      console.warn("⚠️ Cloudinary did not confirm deletion:", result);
    }

    return res.status(200).json({
      success: true,
      message: `✅ Image deleted successfully: ${cloudinaryPublicId}`,
      deletedId: cloudinaryPublicId,
    });
  } catch (error) {
    console.error("❌ Failed to delete image:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};
