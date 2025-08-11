import { axiosClient } from "@/api/axiosClient";
import type {
  ApiError,
  ApiResponse,
  LoginFormDTO,
  RegisterFormDTO,
} from "@/features/auth/schemas/authSchema";
import { create } from "zustand";
import type { UserDTO } from "@/features/user/schemas/userSchema";

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
  registerUser: (formData: RegisterFormDTO) => void;
  verifyEmail: (token: string) => void;
  resendVerificationEmail: (email: string) => void;
  loginUser: (formData: LoginFormDTO) => void;
  logoutUser: () => void;
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

  registerUser: async (formData: RegisterFormDTO) => {
    const {
      startLoading,
      stopLoading,
      handleError,
      handleSuccess,
      clearError,
    } = get();
    try {
      startLoading();
      const res = await axiosClient.post("/auth/register", formData);
      handleSuccess(res, "Registration successful");
      clearError();
    } catch (error) {
      console.error("Registration error:", error);
      handleError(error as ApiError, "Failed to register");
      set({ user: null, isAuthenticated: false });
    } finally {
      stopLoading();
    }
  },

  verifyEmail: async (token: string) => {
    const {
      startLoading,
      stopLoading,
      handleError,
      handleSuccess,
      clearError,
    } = get();
    try {
      startLoading();
      const res = await axiosClient.get(`/auth/verify-email/${token}`);
      handleSuccess(res, "Email verified successfully");
      clearError();
    } catch (error) {
      console.error("Email verification error:", error);
      handleError(error as ApiError, "Failed to verify email");
    } finally {
      stopLoading();
    }
  },

  resendVerificationEmail: async (email: string) => {
    const {
      startLoading,
      stopLoading,
      handleError,
      handleSuccess,
      clearError,
    } = get();
    try {
      startLoading();
      const res = await axiosClient.post("/auth/resend-email", {
        email,
      });
      handleSuccess(res, "Verification email resent successfully");
      clearError();
    } catch (error) {
      console.error("Resend verification email error:", error);
      handleError(error as ApiError, "Failed to resend verification email");
    } finally {
      stopLoading();
    }
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

  logoutUser: async () => {
    const { startLoading, stopLoading, clearError, clearSuccess } = get();
    try {
      startLoading();
      await axiosClient.post("/auth/logout");
      set({ user: null, isAuthenticated: false });
      clearSuccess();
    } catch (error) {
      console.error("Logout error:", error);
      clearError();
    } finally {
      stopLoading();
      clearError();
      clearSuccess();
    }
  },

  fetchUserProfile: async () => {
    const {
      startLoading,
      stopLoading,
      handleError,
      handleSuccess,
      clearError,
      clearSuccess,
    } = get();
    try {
      startLoading();
      const response = await axiosClient.get(`/users/profile`);
      set({ user: response.data.data.user, isAuthenticated: true });
      handleSuccess(response, "User profile fetched successfully");
      clearError();
    } catch (error) {
      console.error("Error fetching user profile:", error);
      handleError(error as ApiError, "Failed to fetch user profile");
    } finally {
      stopLoading();
      clearError();
      clearSuccess();
    }
  },
}));

export { useAuthStore };
