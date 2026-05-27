import { useAuthStore } from '@/stores/use-auth-store';
import axios, { isAxiosError } from 'axios';

import { API_ENDPOINTS } from '@/utils/constants';

export const api = axios.create({
  baseURL: API_ENDPOINTS.BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) config.headers['Authorization'] = `Bearer ${accessToken}`;

  return config;
});

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong') {
  if (isAxiosError(error)) return (error.response?.data as { message?: string } | undefined)?.message ?? fallback;

  return fallback;
}
