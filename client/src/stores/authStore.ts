import { axiosClient } from "@/api/axiosClient";
import type { LoginFormDTO } from "@/features/auth/schemas/authSchema";
import { create } from "zustand";

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

type ApiResponse = {
  data: {
    data: {
      message?: string;
      user?: UserDTO;
    };
  };
};

type UserDTO = {
  id: string;
  fullname: string;
  username: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
};

type AuthStore = {
  user: UserDTO | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  startLoading: () => void;
  stopLoading: () => void;
  clearError: () => void;
  clearSuccess: () => void;
  handleError: (error: ApiError, fallback?: string) => void;
  handleSuccess: (response: ApiResponse, fallback?: string) => void;
  loginUser: (formData: LoginFormDTO) => void;
  fetchUserProfile: () => void;
};

const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  success: null,

  startLoading: () => set({ isLoading: true, error: null }),
  stopLoading: () => set({ isLoading: false }),

  clearError: () => set({ error: null }),
  clearSuccess: () => set({ success: null }),

  handleError: (error: ApiError, fallback = "Something went wrong") => {
    const message =
      error?.response?.data?.message || error?.message || fallback;
    set({ error: message });
  },

  handleSuccess: (response: ApiResponse, fallback = "Operation successful") => {
    const message = response?.data?.data?.message || fallback;
    set({ success: message });
  },

  loginUser: async (formData: LoginFormDTO) => {
    const {
      startLoading,
      stopLoading,
      handleError,
      handleSuccess,
      clearError,
    } = get();
    try {
      startLoading();
      const res = await axiosClient.post("/auth/login", formData);
      set({
        user: res.data.data.user,
        isAuthenticated: true,
      });
      handleSuccess(res, "Login successful");
      clearError();
    } catch (error) {
      console.error("Login error:", error);
      handleError(error as ApiError, "Failed to login");
      set({ user: null, isAuthenticated: false });
    } finally {
      stopLoading();
    }
  },

  fetchUserProfile: async () => {
    const {
      startLoading,
      stopLoading,
      handleError,
      handleSuccess,
      clearError,
    } = get();
    try {
      startLoading();
      const response = await axiosClient.get(`/users/profile`);
      set({ user: response.data.data.user });
      handleSuccess(response, "User profile fetched successfully");
      clearError();
    } catch (error) {
      console.error("Error fetching user profile:", error);
      handleError(error as ApiError, "Failed to fetch user profile");
    } finally {
      stopLoading();
    }
  },
}));

export { useAuthStore };
