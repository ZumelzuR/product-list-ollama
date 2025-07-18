import axios from "axios";

const baseURL = import.meta.env.VITE_OLLAMA_API_HOST;

const ollamaApi = axios.create({
  baseURL,
});

// Attach token from sessionStorage if present
ollamaApi.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default ollamaApi; 