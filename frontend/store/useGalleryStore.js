import { create } from "zustand";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const useGalleryStore = create((set) => ({
  galleryImages: [],
  isUploading: false,
  uploadError: null,
  galleryUrls: [],
  totalUploaded: 0,
  duplicatesSkipped: 0,

  // Setter for updating the gallery images in state
  setGalleryImages: (newImages) => set({ galleryImages: newImages }),

  // Function to delete an image from the gallery
  deleteImage: async (tourId, fileName) => {
    try {
      // Make an API request to delete the image
      const response = await fetch(`${API_URL}/files/${tourId}/${fileName}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        // Update the gallery images in the state by removing the deleted image
        set((state) => ({
          galleryImages: state.galleryImages.filter(
            (image) => image !== fileName
          ),
        }));
      } else {
        console.error("Error deleting image:", data.message);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  },

  uploadFiles: async (id, tourId, formData) => {
    try {
      set({ loading: true });
      const res = await axios.post(
        `${API_URL}/files/admin/${id}/upload/${tourId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      // await useGalleryStore.getState().fetchGallery(tourId); // Refresh after upload
      return res.data;
    } catch (error) {
      console.error("Failed to upload files:", error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  // Action to delete a tour
  deleteTour: async (tourId, fileName) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `${API_URL}/tour/${tourId}/images/${fileName || ""}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (result.success) {
        // Remove the deleted tour from the state
        set((state) => ({
          tours: state.tours.filter((tour) => tour._id !== tourId),
        }));
      } else {
        set({ error: result.message });
      }
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
}));
