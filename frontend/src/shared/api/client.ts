import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Base API URL, defaulting to local API or relative paths if proxied
const API_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach authorization tokens dynamically
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('sges_token'); // ephemeral token (LGPD safety recommended to load from secure context)
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Manage globally triggered API events (e.g., token expiration, server unavailability)
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // Auto-retry once on network failure or rate limiting if request is idempotent
    if (error.message === 'Network Error' && originalRequest) {
      // Custom attribute to avoid infinite loops
      const retryCount = (originalRequest as any)._retryCount || 0;
      if (retryCount < 2) {
        (originalRequest as any)._retryCount = retryCount + 1;
        // Simple delay before retrying
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return apiClient(originalRequest);
      }
    }

    if (error.response) {
      // Handle session expiration (401)
      if (error.response.status === 401) {
        localStorage.removeItem('sges_token');
        // Avoid reload loop or redirect if already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?expired=true';
        }
      }
      
      // Handle forbidden access (403)
      if (error.response.status === 403) {
        console.error('Acesso negado aos dados solicitados.');
      }
    }

    return Promise.reject(error);
  }
);
