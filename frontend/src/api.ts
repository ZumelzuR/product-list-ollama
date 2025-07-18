import axios from "axios";

const baseURL = import.meta.env.VITE_API_HOST || "/api/v1";

const api = axios.create({
  baseURL,
});

// Attach token from sessionStorage if present
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api; 