import { isAxiosError } from 'axios';

import { API_ENDPOINTS } from '@/utils/constants';

import { api } from '@/lib/axios';

// Service functions for authentication-related API calls
export const authService = {
  // Register a new user
  register: async (username: string, password: string, email: string, lastName: string, firstName: string) => {
    const res = await api.post(API_ENDPOINTS.AUTH_REGISTER, { username, password, email, lastName, firstName });

    return res.data;
  },

  // Log in an existing user and return the access token
  logIn: async (email: string, password: string) => {
    const res = await api.post(API_ENDPOINTS.AUTH_LOGIN, { email, password });

    return res.data;
  },

  // Log out the current user
  logOut: async () => await api.post(API_ENDPOINTS.AUTH_LOGOUT, undefined, { withCredentials: true }),

  // Fetch the current user's information
  fetchMe: async () => {
    const res = await api.get(API_ENDPOINTS.USER_ME, { withCredentials: true });

    return res.data?.user;
  },

  // delete the current user's account
  deleteAccount: async () => {
    await api.delete(API_ENDPOINTS.USER_ME, { withCredentials: true });
  },

  // Refresh the access token using the refresh token stored in cookies
  refreshToken: async () => {
    try {
      const res = await api.post(API_ENDPOINTS.AUTH_REFRESH, undefined, { withCredentials: true });

      return res.data.accessToken;
    } catch (error) {
      if (isAxiosError(error) && [401, 403].includes(error.response?.status ?? 0)) return null;

      throw error;
    }
  },
};
