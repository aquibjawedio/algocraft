import { axiosClient } from "@/api/axiosClient";
import type { ApiError, ApiResponse } from "@/features/auth/schemas/authSchema";
import { create } from "zustand";
import type { SubmissionDTO } from "@/features/problem/schemas/problemSchema";

interface TestResultDTO {
  input: string;
  expected: string;
  output: string;
  status: string;
}

type ExecutionStore = {
  testResults: TestResultDTO[] | null;
  submissions: SubmissionDTO[] | null;
  submission: SubmissionDTO | null;
  executing: boolean;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  startLoading: () => void;
  stopLoading: () => void;
  clearError: () => void;
  clearSuccess: () => void;
  handleError: (error: ApiError, fallback?: string) => void;
  handleSuccess: (response: ApiResponse, fallback?: string) => void;
  runCode: (
    slug: string,
    code: string,
    language: string
  ) => void | Promise<void>;
  submitCode?: (
    slug: string,
    code: string,
    language: string
  ) => void | Promise<void>;
  getAllSubmissions: (slug: string) => void | Promise<void>;
};

const useExecutionStore = create<ExecutionStore>((set, get) => ({
  testResults: null,
  submissions: null,
  submission: null,
  executing: false,
  isLoading: false,
  error: null,
  success: null,

  startLoading: () => set({ executing: true, error: null }),
  stopLoading: () => set({ executing: false }),

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

  runCode: async (slug: string, code: string, language: string) => {
    const { startLoading, stopLoading, handleError, handleSuccess } = get();
    try {
      startLoading();
      const response = await axiosClient.post(`/execution/run`, {
        slug,
        code,
        language,
      });
      set({ testResults: response.data.data.result, error: null });
      handleSuccess(response, "Code executed successfully");
    } catch (error) {
      handleError(error as ApiError, "Failed to run code");
    } finally {
      stopLoading();
    }
  },

  submitCode: async (slug: string, code: string, language: string) => {
    const { startLoading, stopLoading, handleError, handleSuccess } = get();
    try {
      startLoading();
      const response = await axiosClient.post(`/execution/submit`, {
        slug,
        code,
        language,
      });
      set({ submission: response.data.data.result, error: null });
      handleSuccess(response, "Code submitted successfully");
      set({
        submissions: [...(get().submissions || []), response.data.data.result],
      });
    } catch (error) {
      handleError(error as ApiError, "Failed to submit code");
    } finally {
      stopLoading();
    }
  },

  getAllSubmissions: async (slug: string) => {
    const { startLoading, stopLoading, handleError } = get();
    try {
      startLoading();
      const response = await axiosClient.get(`/problems/${slug}/submissions`);
      set({ submissions: response.data.data.submissions, error: null });
    } catch (error) {
      handleError(error as ApiError, "Failed to fetch submissions");
    } finally {
      stopLoading();
    }
  },
}));

export { useExecutionStore };
