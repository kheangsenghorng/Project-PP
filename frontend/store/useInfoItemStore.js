import { create } from "zustand";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const useInfoItemStore = create((set) => ({
  infoItems: [],
  loading: false,
  error: null,

  fetchInfoItems: async (tourId) => {
    set({ loading: true });
    try {
      const res = await axios.get(`${API_URL}/info-items/tour/${tourId}`);
      set({ infoItems: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data || "Failed to fetch", loading: false });
    }
  },

  createInfoItem: async (tourId, text) => {
    set({ loading: true });
    try {
      const res = await axios.post(`${API_URL}/info-items/${tourId}`, {
        text,
      });
      set((state) => ({
        infoItems: [...state.infoItems, res.data],
        loading: false,
      }));
    } catch (err) {
      set({ error: err.response?.data || "Failed to create", loading: false });
    }
  },

  updateInfoItem: async (id, text) => {
    set({ loading: true });
    try {
      const res = await axios.put(`${API_URL}/info-items/${id}`, { text });
      set((state) => ({
        infoItems: state.infoItems.map((item) =>
          item._id === id ? res.data : item
        ),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.response?.data || "Failed to update", loading: false });
    }
  },

  deleteInfoItem: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`${API_URL}/info-items/${id}`);
      set((state) => ({
        infoItems: state.infoItems.filter((item) => item._id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.response?.data || "Failed to delete", loading: false });
    }
  },
}));
