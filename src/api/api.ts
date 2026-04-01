import axios, { AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from "axios";
import type { ApiError } from "../types/ApiError";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface QueueItem {
  resolve: (value: string) => void;
  reject: (reason: unknown) => void;
}

interface RefreshResponse {
  accessToken: string;
}

const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL,
});

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig | undefined;

    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
      const apiError: ApiError = {
        status: error.response?.status,
        message: error.response?.data?.message || error.message || "An unknown error occurred",
        errors: error.response?.data?.errors,
      };
      return Promise.reject(apiError);
    }

    if (isRefreshing) {
      try {
        const token = await new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return api(originalRequest);
      } catch (err: unknown) {
        return Promise.reject(err);
      }
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await axios.post<RefreshResponse>(
        `${baseURL}/auth/refresh-token`,
        { refreshToken }
      );

      const { accessToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      
      processQueue(null, accessToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }
      return api(originalRequest);
      
    } catch (refreshError: unknown) {
      processQueue(refreshError, null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userData");

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;