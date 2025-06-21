import { create } from "zustand";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL; // e.g., http://localhost:5000

export const usePastToursStore = create((set) => ({
  tours: [],
  loading: false,
  error: null,
  count: 0,

  fetchPastTours: async (userId) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(
        `${API_URL}/booking/user/${userId}/booked-tours`
      );
      set({
        tours: res.data.tours,
        count: res.data.count,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to load past tours",
        loading: false,
      });
    }
  },
}));
