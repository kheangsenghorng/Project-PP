import express from "express";
import {
  createInfoItem,
  deleteInfoItem,
  getInfoItemsByTour,
  updateInfoItem,
} from "../controllers/infoItemController.js";

const router = express.Router();

router.get("/tour/:tourId", getInfoItemsByTour);
router.post("/:id", createInfoItem);
router.put("/:id", updateInfoItem);
router.delete("/:id", deleteInfoItem);

export default router;
