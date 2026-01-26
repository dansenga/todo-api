import axios from "axios";
import { handleApiError, isAuthError } from "../utils/errorHandler";

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorInfo = handleApiError(error);

    // Handle authentication errors
    if (isAuthError(error)) {
      localStorage.removeItem("token");
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = "/login";
      }
    }

    // Enrich error with user-friendly message
    error.userMessage = errorInfo.message;
    error.userErrors = errorInfo.errors || {};

    return Promise.reject(error);
  }
);

export default api;
