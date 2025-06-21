import { create } from "zustand";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const useAddressStore = create((set) => ({
  address: null,
  loading: false,
  error: null,

  // Fetch Address by User ID
  fetchAddress: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/address/${id}`);
      set({ address: response.data.data.address, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching address",
        loading: false,
      });
    }
  },

  // Create Address
  createAddress: async (userId, addressData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/address/${userId}`,
        addressData
      );
      set({ address: response.data.data.address, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error creating address",
        loading: false,
      });
    }
  },

  // Update Address
  updateAddress: async (addressId, updatedData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(
        `${API_URL}/address/${addressId}`,
        updatedData
      );
      set({ address: response.data.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error updating address",
        loading: false,
      });
    }
  },

  // Delete Address
  deleteAddress: async (addressId) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/${API_URL}/address/${addressId}`);
      set({ address: null, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting address",
        loading: false,
      });
    }
  },
}));
