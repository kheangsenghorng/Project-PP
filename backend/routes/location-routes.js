import express from "express";
import {
  byIdLocation,
  createLocation,
  deleteLocation,
  getAllLocations,
  getLocationBySlug,
  getTourWithLocations,
  updateLocation,
} from "../controllers/location-controllers.js";

const router = express.Router();

router.post("/", createLocation);
router.get("/", getAllLocations);
router.get("/:locId", byIdLocation);
router.get("/tours/:id/with-locations", getTourWithLocations);
router.get("/:slug", getLocationBySlug);
router.put("/:slug", updateLocation);
router.delete("/:slug", deleteLocation);

export default router;
