import { create } from "zustand";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const useCategoryStore = create((set) => ({
  categories: [],
  loading: false,
  error: null,

  // Fetch all categories
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/categories`);
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      set({ categories: data });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  // Create a new category
  createCategory: async (name) => {
    set({ error: null });
    try {
      const response = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        throw new Error("Failed to create category");
      }
      const newCategory = await response.json();
      set((state) => ({
        categories: [...state.categories, newCategory.category],
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  updateCategory: async (slug, data) => {
    set({ loading: true });
    try {
      const res = await axios.put(`${API_URL}/categories/${slug}`, data);
      set((state) => ({
        categories: state.categories.map((categorie) =>
          categorie.slug === slug ? res.data : categorie
        ),
        loading: false,
      }));
    } catch (err) {
      set({
        error: err.response?.data?.error || "Failed to update",
        loading: false,
      });
    }
  },

  deleteCategory: async (slug) => {
    set({ loading: true });
    try {
      await axios.delete(`${API_URL}/categories/${slug}`);
      set((state) => ({
        categories: state.categories.filter(
          (category) => category.slug !== slug
        ),
        loading: false,
      }));
    } catch (err) {
      set({
        error: err.response?.data?.error || "Failed to delete",
        loading: false,
      });
    }
  },
}));
