import axios, { isAxiosError } from 'axios';

import { API_ENDPOINTS } from '@/utils/constants';

export const api = axios.create({
  baseURL: API_ENDPOINTS.BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong') {
  if (isAxiosError(error)) return (error.response?.data as { message?: string } | undefined)?.message ?? fallback;

  return fallback;
}
