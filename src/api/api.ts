import axios, { AxiosError } from "axios";
import type { ApiError } from "../types/ApiError";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api/v1",
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: string) => void; reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as any;

    // If error is 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Call your refresh token endpoint
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api/v1"}/auth/refresh-token`,
          { refreshToken }
        );

        const { accessToken } = response.data;
        
        // Store new access token
        localStorage.setItem("accessToken", accessToken);
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        processQueue(refreshError, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userData");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const apiError: ApiError = {
      status: error.response?.status,
      message:
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred",
      errors: error.response?.data?.errors,
    };
    return Promise.reject(apiError);
  }
);

export default api;