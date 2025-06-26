import { create } from "zustand";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL; // Use the correct API URL

export const useBookingStore = create((set) => ({
  bookings: [],
  bookingsUser: [],
  bookingAll: [],
  tourSeatCounts: [],
  groupedBookings: [],
  totalSit: 0,
  totalPrice: 0,
  total: 0,
  totalBookings: 0,
  totalSeats: 0,
  totalUniqueUsers: 0,
  loading: false,
  error: null,
  success: false,
  bookingData: null,

  fetchTourBookings: async (id, tourId) => {
    set({ loading: true, error: null });

    try {
      const res = await fetch(`${API_URL}/booking/admin/${id}/tour/${tourId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to fetch bookings");
      }

      const data = await res.json();

      set({
        bookings: data.bookings, // Flat array of all bookings
        groupedBookings: data.groupedBookings, // Aggregated bookings per user
        totalBookings: data.totalBookings,
        totalUniqueUsers: data.totalUniqueUsers,
        loading: false,
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchBookingsByUserId: async (userId) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/booking/user/${userId}`);
      const { groupedBookings, totalBookings, totalUniqueTours } =
        response.data;
      set({
        bookings: groupedBookings,
        totalBookings,
        totalUniqueTours,
        loading: false,
      });
    } catch (error) {
      // console.error("Fetch bookings failed:", error);

      set({
        bookings: [],
        totalBookings: 0,
        totalUniqueTours: 0,
        loading: false,
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      });
    }
  },

  resetBookings: () => {
    set({
      bookings: [],
      totalBookings: 0,
      totalUniqueUsers: 0,
      loading: false,
      error: null,
    });
  },
  fetchAllTourBookings: async () => {
    set({ loading: true, error: null });

    try {
      const res = await fetch(`${API_URL}/booking`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to fetch bookings");
      }

      const data = await res.json();
      set({
        bookings: data.bookings,
        total: data.totalBookings,
        tourSeatCounts: data.tourSeatCounts,
        loading: false,
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
  createBooking: async ({ user_id, tour_id, seats, total }) => {
    set({ loading: true, error: null, success: false });

    try {
      const formData = new FormData();
      formData.append("bookingSit", seats);
      formData.append("bookingTotal", total);

      const response = await axios.post(
        `${API_URL}/booking/tour/${tour_id}/user/${user_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Booking success:", response.data);

      set({
        bookingData: response.data,
        success: true,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Booking failed",
        loading: false,
        success: false,
      });
    }
  },

  fetchBookingsByUser: async (userId) => {
    set({ isLoading: true, error: null });

    try {
      const res = await axios.get(`${API_URL}/booking/by-user/${userId}`);

      set({
        bookingAll: res.data.bookings,
        totalSeats: res.data.totalSeats,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error?.response?.data?.message || "Failed to fetch bookings",
        isLoading: false,
      });
    }
  },

  fetchTourBookingsUser: async (tourId, userId) => {
    set({ loading: true });
    try {
      const response = await fetch(
        `${API_URL}/booking/by-user/${userId}/tour/${tourId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      const data = await response.json();
      // console.log(data);

      set({
        bookingsUser: data.bookings,
        totalSit: data.totalSit,
        totalPrice: data.totalPrice,
        bookingCount: data.bookingCount,
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  resetStatus: () => set({ error: null, success: false, bookingData: null }),

  clearBookings: () => set({ bookings: [], tourSeatCounts: [], error: null }),
}));
