import { create } from "zustand";

// const API_URL = "http://localhost:4000/api/auth";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth`;

export const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  image: null,
  isAuthenticated: false,
  isCheckingAuth: false,
  message: null,
  users: [],
  userCount: 0, // Initialize with 0
  subAdminCount: 0, //
  token: null,

  // Use `get` to access the current state

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch users");
      set({ users: data.users, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchUserCounts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/count-users-and-subadmins`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch counts");

      // Set the counts in the store
      set({
        userCount: data.userCount,
        subAdminCount: data.subAdminCount,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchCompanyById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user details");
      }
      set({ user: data.user, isLoading: false }); // Update the user state
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  fetchUserById: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user details");
      }
      return data.user; // Return the user data
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  getUserNameById: async (userId) => {
    try {
      const user = await fetchUserById(userId);
      if (user && user.name) {
        return user.name;
      } else {
        throw new Error("User not found or name not available");
      }
    } catch (error) {
      console.error("Error getting user name:", error);
      throw error;
    }
  },
  // Edit user admin edit user
  editUser: async (userId, name, email, role, status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email, role, status }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to update user");

      // Update user in the state
      set({
        users: get().users.map((user) =>
          user._id === userId ? { ...user, name, email, role, status } : user
        ),
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    if (!userId) {
      console.error("Invalid userId:", userId);
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        console.error(
          "Failed to delete user:",
          data.message || "Unknown error"
        );
        throw new Error(data.message || "Failed to delete user");
      }

      // Use `get` to access the current state
      set({
        users: get().users.filter((user) => user._id !== userId),
        isLoading: false,
      });
      console.log("User deleted successfully:", userId);
    } catch (error) {
      console.error("Delete user error:", error.message);
      set({ error: error.message, isLoading: false });
    }
  },

  // signup: async (name, email, password) => {
  //   set({ isLoading: true, error: null });
  //   try {
  //     const response = await fetch(`${API_URL}/signup`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       credentials: "include",
  //       body: JSON.stringify({
  //         name,
  //         email,
  //         password,
  //       }),
  //     });
  //     const data = await response.json();
  //     if (!response.ok)
  //       throw new Error(data.message || "Signup failed. Please try again.");
  //     set({ user: data.user, isLoading: false, error: null });
  //   } catch (error) {
  //     set({ isLoading: false, error: error.message });
  //     throw error;
  //   }
  // },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      set({ isLoading: false, isAuthenticated: true, user: data.user });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.log(error);
    }
  },
  login: async (email, password) => {
    set({ isCheckingAuth: true, error: null });

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials"); 
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token); // Save token after receiving it
      }

      if (data.user && data.user.role) {
        set({
          isAuthenticated: true,
          user: data.user,
          token: data.token,
          isCheckingAuth: false,
        });

        return data.user; // Return user info
      } else {
        throw new Error("Login failed: Role not found");
      }
    } catch (error) {
      set({
        isCheckingAuth: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: error.message,
      });
      throw error; // Let the caller handle the error
    }
  },

  // Fetch user profile
  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch profile");
      }
      const data = await response.json();
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({ error: err.message, isAuthenticated: false, isLoading: false });
    }
  },

  signup: async (firstname, lastname, phonenumber, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          firstname,
          lastname,
          phonenumber,
          email,
          password,
        }),
      });
      const data = await response.json();
      console.log(data);

      set({ isLoading: false, isAuthenticated: true, user: data.user });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.log(error);

      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await fetch(`${API_URL}/auth/check-auth`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (data.user) {
        set({ isAuthenticated: true, user: data.user, isCheckingAuth: false });
      } else {
        set({ isAuthenticated: false, user: null, isCheckingAuth: false });
      }
    } catch (error) {
      set({ isCheckingAuth: false, isAuthenticated: false, user: null });
      console.log(error);
    }
  },
  // logout: async () => {
  //   set({ isLoading: true, error: null });
  //   try {
  //     const response = await fetch(`${API_URL}/logout`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include",
  //     });
  //     set({ isLoading: false, isAuthenticated: false, user: null });
  //   } catch (error) {
  //     set({ isLoading: false, error: error.message });
  //     throw error;
  //   }
  // },
  uploadImage: async (file) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/upload-image`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to upload image");
      }

      set({ image: data.imageUrl, isLoading: false }); // Update image state
      return data.imageUrl; // Return the image URL
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  fetchImage: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user details");
      }
      set({ image: data.user.imageUrl, isLoading: false }); // Update image state
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  // forgotPassword: async (email) => {
  //   set({ isLoading: true, error: null });
  //   try {
  //     const response = await fetch(`${API_URL}/forgot-password`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include",
  //       body: JSON.stringify({ email }),
  //     });
  //     const data = await response.json();
  //     console.log(data.message);
  //     set({ isLoading: false, message: data.message });
  //   } catch (error) {
  //     set({ isLoading: false, error: error.message });
  //     console.log(error);
  //   }
  // },
  // resetPassword: async (token, password) => {
  //   set({ isLoading: true, error: null });
  //   try {
  //     const response = await fetch(`${API_URL}/reset-password/${token}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include",
  //       body: JSON.stringify({ password }),
  //     });
  //     const data = await response.json();
  //     set({ isLoading: false, message: data.message });
  //   } catch (error) {
  //     set({ isLoading: false, error: error.message });
  //     console.log(error);
  //     throw error;
  //   }
  // },
}));
