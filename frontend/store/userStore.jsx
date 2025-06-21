import { create } from "zustand";
import axios from "axios";


const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL; // Use base URL, don't append `/auth`

export const userStore = create((set) => ({
  user: null,
  useById: null,
  loading: false,
  error: null,
  count: 0,
  users: [],

  // Fetch a user by ID
  fetchUserById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/auth/users/${id}`); // Ensure correct endpoint
      set({ user: response.data.user, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch user",
        loading: false,
      });
    }
  },
  fetchUserByIdadmin: async (id, userId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/auth/${id}/${userId}/users`); // Ensure correct endpoint
      set({ useById: response.data.useById, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch user",
        loading: false,
      });
    }
  },
  // Function to edit user data
  editUser: async (id, updateFields) => {
    set({ loading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/auth/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateFields),
      });

      const data = await response.json();

      if (response.ok) {
        set({ user: data.user, loading: false });
      } else {
        set({ error: data.message, loading: false });
      }
    } catch (error) {
      set({ error: "Failed to update user.", loading: false });
    }
  },
  setUser: (user, token) => set({ user, token }),
  logout: async () => {
    try {
      const res = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // Ensures cookies are sent with the request
      });

      if (res.ok) {
        set({ user: null, token: null });
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },

  getAllUsers: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/auth/${id}/users`); // Ensure correct endpoint
      set({
        users: response.data.users,
        loading: false,
        count: response.data.userCount,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch users",
        loading: false,
      });
    }
  },
}));
