import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach preferred language header if available
api.interceptors.request.use((config) => {
  try {
    const lang = localStorage.getItem('preferred_language');
    if (lang) {
      config.headers = config.headers || {};
      // Standard header for content-language preference
      config.headers['Accept-Language'] = lang;
    }
  } catch {
    // ignore
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;