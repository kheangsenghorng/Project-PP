// stores/useTourHistoryStore.js
import { create } from "zustand";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const useTourHistoryStore = create((set) => ({
  bookings: [],
  isLoading: false,
  error: null,

  fetchBookings: async (userId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/tour-history/${userId}`);
      set({ bookings: response.data, isLoading: false });
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      set({ error: "Failed to fetch bookings", isLoading: false });
    }
  },
}));
