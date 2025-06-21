import { create } from "zustand";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const useItineraryStore = create((set) => ({
  itineraries: [],
  loading: false,
  error: null,

  fetchItinerariesByTourId: async (tourId) => {
    if (!tourId) {
      set({ error: "Tour ID is required" });
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await axios.get(
        `${API_URL}/itinerarie/itineraries/${tourId}`
      );
      set({ itineraries: response.data.itineraries, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch itineraries",
        loading: false,
      });
    }
  },

  clearItineraries: () => set({ itineraries: [], error: null }),
}));
