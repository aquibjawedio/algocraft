import { axiosClient } from "@/api/axiosClient";
import type { ApiError, ApiResponse } from "@/features/auth/schemas/authSchema";
import { create } from "zustand";
import type { ProblemSchemaDTO } from "@/features/problem/schemas/problemSchema";

type ProblemStore = {
  problems: ProblemSchemaDTO[] | null;
  problem: ProblemSchemaDTO | null;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  startLoading: () => void;
  stopLoading: () => void;
  clearError: () => void;
  clearSuccess: () => void;
  handleError: (error: ApiError, fallback?: string) => void;
  handleSuccess: (response: ApiResponse, fallback?: string) => void;
  getAllProblems: () => void | Promise<void>;
  getProblemBySlug: (slug: string) => void | Promise<void>;
};

const useProblemStore = create<ProblemStore>((set, get) => ({
  problems: null,
  problem: null,
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

  getAllProblems: async () => {
    const { startLoading, stopLoading, handleError, handleSuccess } = get();
    try {
      startLoading();
      const response = await axiosClient.get("/problems");
      set({ problems: response.data.data.problems, error: null });
      handleSuccess(response, "Problems fetched successfully");
    } catch (error) {
      handleError(error as ApiError, "Failed to fetch problems");
    } finally {
      stopLoading();
    }
  },

  getProblemBySlug: async (slug: string) => {
    const { startLoading, stopLoading, handleError, handleSuccess } = get();
    try {
      startLoading();
      const response = await axiosClient.get(`/problems/${slug}`);
      set({ problem: response.data.data.problem, error: null });
      handleSuccess(response, "Problem fetched successfully");
    } catch (error) {
      handleError(error as ApiError, "Failed to fetch problem");
    } finally {
      stopLoading();
    }
  },

}));

export { useProblemStore };
