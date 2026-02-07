import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

const backendUrl: string =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const axiosClient: AxiosInstance = axios.create({
  baseURL: `${backendUrl}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshClient: AxiosInstance = axios.create({
  baseURL: `${backendUrl}/api/v1`,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
}[] = [];

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log("Request URL:", config.url);
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError): Promise<AxiosResponse | unknown> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error?.response?.status === 401 &&
      error.response.data &&
      (error.response.data as { message?: string }).message ===
        "ACCESS TOKEN EXPIRED" &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => axiosClient(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await refreshClient.get("/auth/refresh");

        failedQueue.forEach(({ resolve }) => resolve());
        failedQueue = [];

        return axiosClient(originalRequest);
      } catch (refreshError) {
        failedQueue.forEach(({ reject }) => reject(refreshError));
        failedQueue = [];

        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export { axiosClient };
