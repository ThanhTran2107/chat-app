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
  logIn: async (username: string, password: string) => {
    const res = await api.post(API_ENDPOINTS.AUTH_LOGIN, { username, password });

    return res.data;
  },

  // Log out the current user
  logOut: async () => await api.post(API_ENDPOINTS.AUTH_LOGOUT, { withCredentials: true }),

  // Fetch the current user's information
  fetchMe: async () => {
    const res = await api.get(API_ENDPOINTS.USER_ME, { withCredentials: true });

    return res.data?.user;
  },

  // Refresh the access token using the refresh token stored in cookies
  refreshToken: async () => {
    const res = await api.post(API_ENDPOINTS.AUTH_REFRESH, { withCredentials: true });

    return res.data.accessToken;
  },
};
