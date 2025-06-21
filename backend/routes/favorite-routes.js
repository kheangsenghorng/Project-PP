import express from "express";
import {
  addFavorite,
  getUserFavoriteTours,
  removeFavorite,
} from "../controllers/favoriteController.js";
import { verifyUser } from "../middlewares/userVeriffy.js";

const router = express.Router();

// Route to add a favorite tour
router.post("/add/:userId/:tourId", addFavorite);

// Route to remove a favorite tour
router.delete("/remove/:userId/:tourId", removeFavorite);

// Route to get all favorite tours for a user
router.get("/favorite/:userId", getUserFavoriteTours);

export default router;
