import { useAuthStore } from '@/stores/use-auth-store';
import axios, { isAxiosError } from 'axios';

import { API_ENDPOINTS } from '@/utils/constants';
import { ROUTES } from '@/utils/constants';

// Create an Axios instance with default configuration for API calls
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Base URL for the API, defined in constants
  withCredentials: true, // Include cookies in requests for authentication
  headers: {
    'Content-Type': 'application/json',
  }, // You can add other default headers here if needed
});

// Request interceptor to add the Authorization header with the access token for authenticated requests
api.interceptors.request.use(config => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) config.headers['Authorization'] = `Bearer ${accessToken}`;

  return config;
});

// Response interceptor to handle 403 errors by attempting to refresh the access token and retrying the original request
api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config; // The original request that caused the error

    // If the error is related to authentication endpoints, do not attempt to refresh and reject immediately
    if (
      originalRequest.url.includes(API_ENDPOINTS.AUTH_LOGIN) ||
      originalRequest.url.includes(API_ENDPOINTS.AUTH_REFRESH) ||
      originalRequest.url.includes(API_ENDPOINTS.AUTH_REGISTER)
    ) {
      // If refresh token endpoint returns 401, force redirect to login
      if (originalRequest.url.includes(API_ENDPOINTS.AUTH_REFRESH) && error.response?.status === 401) {
        useAuthStore.getState().clearState();
        window.location.replace(ROUTES.LOGIN);
      }

      return Promise.reject(error);
    }

    originalRequest._retryCount = originalRequest._retryCount || 0; // Initialize retry count for the original request

    // If the error status is 403 (Forbidden) and we haven't exceeded the retry limit, attempt to refresh the token
    if (error.response?.status === 403 && originalRequest._retryCount < 4) {
      originalRequest._retryCount += 1;

      try {
        const res = await api.post(API_ENDPOINTS.AUTH_REFRESH, { withCredentials: true });
        const newAccessToken = res.data.accessToken;

        useAuthStore.getState().setAccessToken(newAccessToken); // Update the access token in the auth store

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (e) {
        console.error('Token refresh error:', e);
        useAuthStore.getState().clearState();

        return Promise.reject(e);
      }
    }
  },
);

// Utility function to extract error messages from Axios errors, with a fallback message
export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong') {
  if (isAxiosError(error)) return (error.response?.data as { message?: string } | undefined)?.message ?? fallback;

  return fallback;
}
