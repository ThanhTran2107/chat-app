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
      originalRequest.url.includes(API_ENDPOINTS.AUTH_REGISTER) ||
      originalRequest.url.includes(API_ENDPOINTS.AUTH_LOGOUT)
    ) {
      // If refresh token endpoint returns 401, force redirect to login
      if (originalRequest.url.includes(API_ENDPOINTS.AUTH_REFRESH) && error.response?.status === 401) {
        useAuthStore.getState().clearState();
        window.location.replace(ROUTES.LOGIN);
      }

      return Promise.reject(error);
    }

    const responseMessage = (error.response?.data as { message?: string } | undefined)?.message ?? '';

    const isAuthError =
      error.response?.status === 401 ||
      responseMessage.toLowerCase().includes('jwt expired') ||
      responseMessage.toLowerCase().includes('token expired') ||
      responseMessage.toLowerCase().includes('invalid token');

    originalRequest._retryCount = originalRequest._retryCount || 0;

    // Attempt refresh once when the access token is expired or unauthorized
    if (
      isAuthError &&
      originalRequest._retryCount < 1 &&
      !originalRequest.url.includes(API_ENDPOINTS.AUTH_LOGIN) &&
      !originalRequest.url.includes(API_ENDPOINTS.AUTH_REFRESH) &&
      !originalRequest.url.includes(API_ENDPOINTS.AUTH_REGISTER) &&
      !originalRequest.url.includes(API_ENDPOINTS.AUTH_LOGOUT)
    ) {
      originalRequest._retryCount += 1;

      try {
        const res = await api.post(API_ENDPOINTS.AUTH_REFRESH, undefined, { withCredentials: true });
        const newAccessToken = res.data.accessToken;

        if (!newAccessToken) throw new Error('Unable to refresh access token');

        useAuthStore.getState().setAccessToken(newAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh error:', refreshError);
        useAuthStore.getState().clearState();
        window.location.replace(ROUTES.LOGIN);

        return Promise.reject(refreshError);
      }
    }

    if (isAuthError) {
      useAuthStore.getState().clearState();
      window.location.replace(ROUTES.LOGIN);
    }

    return Promise.reject(error);
  },
);

// Utility function to extract error messages from Axios errors, with a fallback message
export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong') {
  if (isAxiosError(error)) return (error.response?.data as { message?: string } | undefined)?.message ?? fallback;

  return fallback;
}
