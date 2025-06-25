// Express Backend
import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDatabase from "./database/db.js";
import authRoutes from "./routes/user-routes.js";
import filerouter from "./routes/file-rotes.js";
import addressrouter from "./routes/address-routes.js";
import tourRouter from "./routes/tour-routes.js";
import favorite from "./routes/favorite-routes.js";
import reviewRoutes from "./routes/review-routes.js";
import itineraryRouter from "./routes/itineraries-routes.js";
import locationRoutes from "./routes/location-routes.js";
import categoryRoutes from "./routes/category-routes.js";
import bookingRoutes from "./routes/bookingTour-routes.js";
import additionalInfoItemRoutes from "./routes/infoItemRoutes.js"; // Ensure this route is defined in your routes
import tourhistoryRouter from "./routes/tourHistory-routes.js";

dotenv.config();

const app = express();
// Serve static files from the 'uploads' directory

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

connectToDatabase();

app.get("/", (req, res) => {
  res.json("Hello");
});
app.use("/api/auth", authRoutes);
app.use("/api/files", filerouter);
app.use("/api/address", addressrouter);
app.use("/api/tour", tourRouter);
app.use("/api/favorites", favorite);
app.use("/api/reviews", reviewRoutes);
app.use("/api/itinerarie", itineraryRouter);
app.use("/api/locations", locationRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/info-items", additionalInfoItemRoutes); // Ensure this route is defined in your routes
app.use("/api/tour-history", tourhistoryRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
