import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/category-controller.js";

const router = express.Router();

// Route to create a new category
router.post("/", createCategory);

// Route to get all categories
router.get("/", getCategories);

// Route to get a single category by ID
router.get("/:id", getCategoryById);

// Route to update a category by ID
router.put("/:slug", updateCategory);

// Route to delete a category by ID
router.delete("/:slug", deleteCategory);

export default router;
