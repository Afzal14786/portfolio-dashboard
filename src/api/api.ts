import axios, { AxiosError } from "axios";
import type { ApiError } from "../types/ApiError";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api/v1",
});

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
  (error: AxiosError<ApiError>) => {
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
