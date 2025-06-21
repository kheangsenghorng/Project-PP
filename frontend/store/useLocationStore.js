import { create } from "zustand";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL; // e.g., http://localhost:5000 or deployed URL

export const useLocationStore = create((set) => ({
  locations: [],
  tour: null,
  location: null,
  loading: false,
  error: null,

  fetchLocations: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${API_URL}/locations`);
      set({ locations: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.error || "Failed to fetch",
        loading: false,
      });
    }
  },

  fetchLocationBySlug: async (slug) => {
    set({ loading: true });
    try {
      const res = await axios.get(`${API_URL}/locations/${slug}`);
      set({ location: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.error || "Failed to fetch",
        loading: false,
      });
    }
  },

  createLocation: async (data) => {
    set({ loading: true });
    try {
      const res = await axios.post(`${API_URL}/locations`, data);
      set((state) => ({
        locations: [...state.locations, res.data],
        loading: false,
      }));
    } catch (err) {
      set({
        error: err.response?.data?.error || "Failed to create",
        loading: false,
      });
    }
  },

    updateLocation: async (slug, data) => {
      set({ loading: true });
      try {
        const res = await axios.put(`${API_URL}/locations/${slug}`, data);
        set((state) => ({
          locations: state.locations.map((loc) =>
            loc.slug === slug ? res.data : loc
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

  deleteLocation: async (slug) => {
    set({ loading: true });
    try {
      await axios.delete(`${API_URL}/locations/${slug}`);
      set((state) => ({
        locations: state.locations.filter((loc) => loc.slug !== slug),
        loading: false,
      }));
    } catch (err) {
      set({
        error: err.response?.data?.error || "Failed to delete",
        loading: false,
      });
    }
  },
  // Function to fetch location by ID
  fetchLocationById: async (locId) => {
    try {
      const response = await fetch(`${API_URL}/locations/${locId}`);
      if (!response.ok) {
        throw new Error("Location not found");
      }
      const data = await response.json();
      set({ location: data, error: null });
    } catch (error) {
      set({ error: error.message, location: null });
    }
  },

  fetchTourWithLocations: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/locations/tours/${id}/with-locations`
      );
      set({ tour: response.data.tour, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch tour:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
