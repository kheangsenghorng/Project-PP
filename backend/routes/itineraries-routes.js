import express from "express";

import { getItinerariesByTourId } from "../controllers/itinerary-controllers.js";

const router = express.Router();

router.get("/itineraries/:tourId", getItinerariesByTourId);



export default router;