import axios from "axios";
import { handleApiError, isAuthError } from "../utils/errorHandler";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Ajouter automatiquement le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gestion globale des erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorInfo = handleApiError(error);

    // Si erreur d'authentification, rediriger vers login
    if (isAuthError(error)) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    // Enrichir l'erreur avec les informations formatées
    error.userMessage = errorInfo.message;
    error.userErrors = errorInfo.errors || {};

    return Promise.reject(error);
  }
);

export default api;
