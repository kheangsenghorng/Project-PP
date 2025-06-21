import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

console.log("✅ Cloudinary configured with:", {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY ? "***" : "Missing API Key",
  api_secret: process.env.API_SECRET ? "***" : "Missing API Secret",
});


// (async function run() {
//   try {
//     for (const image of images) {
//       const result = await cloudinary.uploader.upload(image, {
//         folder: "tours", // optional Cloudinary folder
//       });
//       console.log("✅ Uploaded:", result.secure_url);
//     }
//   } catch (error) {
//     console.error("❌ Upload failed:", error.message);
//   }
// })();

export default cloudinary;
