// store/userStore.js
import { create } from "zustand";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const profileStore = create((set) => ({
  user: null, // User data
  users: [], // All users
  isAuthenticated: false, // Authentication status
  loading: false, // Loading state
  error: null, // Error state
  profileImage: null,
  // Action to set user data
  setUser: (user) => set({ user, isAuthenticated: !!user }),

  // Action to update user profile
  uploadProfileImage: async (userId, file) => {
    set({ loading: true, error: null, success: false });

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Make a POST request to your backend API
      const response = await fetch(
        `${API_URL}/files/upload-profile/${userId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload profile image");
      }

      const data = await response.json();

      // Ensure the profile image URL is valid
      const profileImageUrl = data.profile_image.startsWith("http")
        ? data.profile_image // Use as-is if it's already a full URL
        : `${API_URL}/files/profile-image/${userId}`; // Construct full URL if it's a relative path

      set({ profileImage: profileImageUrl, success: true, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchProfileImage: async (id) => {
    try {
      const response = await fetch(`${API_URL}/files/profile-image/${id}`);

      // if (!response.ok) {
      //   throw new Error("Failed to fetch profile image");
      // }

      // Convert response to Blob and create a URL
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);

      set({ profileImage: imageUrl });
    } catch (error) {
      console.error("Error fetching profile image:", error);
      set({ profileImage: null });
    }
  },

  fetchUsers: async (id) => {
    set({ loading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/files/profile/${id}`);
      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      set({ users: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  // Action to delete user
  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      // Simulate an API call to delete user
      await fetch(`/api/users/${id}`, { method: "DELETE" });
      set({ user: null, isAuthenticated: false, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Action to log out
  logout: () => set({ user: null, isAuthenticated: false }),
}));
