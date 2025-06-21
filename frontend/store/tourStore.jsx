import { create } from "zustand";
import axios from "axios";
//Url backenc
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const useTourStore = create((set) => ({
  galleryImages: [],
  gallery: [],
  countTour: [],
  tours: [],
  isLoading: false,
  tour: null,
  totalSit: 0,
  totalPrice: 0,
  itineraries: [],
  loading: false,
  error: null,
  isChecking: false,
  exists: null,
  itineraries: [],

  fetchGalleryImages: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/files/gallery`);
      const data = await res.json();

      if (data.success) {
        set({
          galleryImages: data.allGalleryImages,
          countTour: data.count,
          loading: false,
        });
      } else {
        set({ error: data.message, loading: false });
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  fetchGallery: async (tourId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/files/galleryid/${tourId}`);
      const data = await response.json();

      if (data.success) {
        set({ gallery: data.tour.galleryImages, loading: false });
      } else {
        set({ error: data.message, loading: false });
      }
    } catch (error) {
      set({ error: "Failed to fetch gallery", loading: false });
    }
  },
  fetchTour: async (tourId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/files/galleryid/${tourId}`);
      const data = await response.json();

      if (data.success) {
        set({
          tour: data.tour,
          totalSit: data.totalSit,
          totalPrice: data.totalPrice,
          itineraries: data.itineraries, // Fixed typo: tineraries -> itineraries
          loading: false,
        });
      } else {
        set({ error: data.message || "Failed to fetch tour", loading: false });
      }
    } catch (error) {
      console.error("Error fetching tour:", error);
      set({ error: "Failed to fetch gallery", loading: false });
    }
  },

  // Fetch all tours from the backend
  fetchTours: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/tour/${id}/tours`); // Adjust API path if necessary
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch tours");
      }

      set({ tours: data.tours, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  //fetch all tour from the backend no id
  fetchAllTours: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/tour/tours`); // Adjust API path if necessary
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch tours");
      }

      set({ tours: data.tours, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  // ✅ Filter tours by price range
  filterToursByPrice: async ({ minPrice, maxPrice }) => {
    set({ isLoading: true, error: null });

    try {
      const params = new URLSearchParams();

      if (minPrice !== undefined && minPrice !== null)
        params.append("minPrice", String(minPrice));
      if (maxPrice !== undefined && maxPrice !== null)
        params.append("maxPrice", String(maxPrice));

      if (!API_URL) throw new Error("API_URL is not defined!");

      const queryString = params.toString();
      const url = `${API_URL}/tour/filter${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to filter tours");
      }

      set({ tours: data.tours, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        isLoading: false,
      });
    }
  },
  // ✅ Filter tours by duration
  filterToursByDuration: async (duration) => {
    set({ isLoading: true, error: null });

    try {
      if (!duration || isNaN(duration)) {
        throw new Error("Invalid duration");
      }

      const response = await fetch(`${API_URL}/tour/day?duration=${duration}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to filter tours by duration");
      }

      set({ tours: data.tours, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unexpected error",
        isLoading: false,
      });
    }
  },

  filterParams: {
    location: "",
    startDate: null,
    endDate: null,
  },

  setFilterParams: (params) => {
    set((state) => ({
      filterParams: { ...state.filterParams, ...params },
    }));
  },

  fetchFilteredTours: async () => {
    set({ loading: true, error: null });

    try {
      const { location, startDate, endDate } =
        useTourStore.getState().filterParams;

      const response = await axios.get(`${API_URL}/tour/filter/location-date`, {
        params: { location, startDate, endDate },
      });

      set({ tours: response.data.tours, loading: false });
    } catch (error) {
      console.error("Failed to fetch filtered tours:", error);
      set({
        error: error.response?.data?.message || "Something went wrong",
        loading: false,
      });
    }
  },

  // Rating-related state and actions
  ratingFilter: null, // Current rating filter
  setRatingFilter: (rating) => set({ ratingFilter: rating }), // Set rating filter
  setTours: (tours) => set({ tours }), // Set tours after fetch
  fetchToursByRating: async (rating) => {
    try {
      const response = await fetch(`${API_URL}/tour/ratings?rating=${rating}`);
      const data = await response.json();
      if (data.success) {
        set({ tours: data.tours });
      } else {
        set({ tours: [] }); // Clear if no tours are found
      }
    } catch (error) {
      console.error("Error fetching tours:", error);
    }
  },

  checkTourId: async (tour_id) => {
    if (!tour_id) return set({ exists: null });

    set({ isChecking: true, error: null });

    try {
      const res = await axios.get(`${API_URL}/tour/check-tour-id`, {
        params: { tour_id },
      });
      set({ exists: res.data.exists, isChecking: false });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to check",
        isChecking: false,
      });
    }
  },

  createTour: async (formData, id) => {
    set({ loading: true, error: null });

    try {
      const res = await axios.post(`${API_URL}/tour/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        set((state) => ({
          tours: [...state.tours, res.data.tour],
          loading: false,
        }));
      } else {
        set({
          loading: false,
          error: res.data.message || "Create tour failed",
        });
      }
      console.log("Create tour response:", res.data);
    } catch (error) {
      set({
        loading: false,
        error: error?.response?.data?.message || "Create tour error",
      });
      console.error(
        "Create tour error:",
        error?.response?.data || error.message
      );
    }
  },

  // stores/tourStore.jsx

  updateTour: async (tourId, updatedData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(
        `${API_URL}/tour/edit/${tourId}`,
        updatedData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Update tour response:", res.data);

      set({
        tour: res.data.tour,
        itineraries: res.data.itineraries, // Must match backend
        loading: false,
      });
    } catch (err) {
      console.error("Error updating tour:", err);
      set({
        error: err.response?.data?.message || "Something went wrong",
        loading: false,
      });
    }
  },

  accommodation: Array(8).fill("0"), // default: 8 zeros

  setAccommodation: (index, value) =>
    set((state) => {
      const updated = [...state.accommodation];
      updated[index] = value;
      return { accommodation: updated };
    }),

  updateAccommodationOnServer: async (tourId) => {
    try {
      const { accommodation } = useTourStore.getState();

      const response = await axios.put(
        `${API_URL}/tour/tours/${tourId}/accommodation`,
        {
          accommodation,
        }
      );

      console.log("Updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
      throw error;
    }
  },
  fetchToursByAccommodation: async (accommodation) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/tour/by-accommodation?accommodation=${accommodation}`
      );
      set({ tours: response.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch tours",
        loading: false,
      });
    }
  },

  clearTour: () => set({ tour: null, itineraries: [] }),
}));
