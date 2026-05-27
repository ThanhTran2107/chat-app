import { API_ENDPOINTS } from '@/utils/constants';

import { api } from '@/lib/axios';

export const authService = {
  register: async (username: string, password: string, email: string, lastName: string, firstName: string) => {
    const res = await api.post(API_ENDPOINTS.AUTH_REGISTER, { username, password, email, lastName, firstName });

    return res.data;
  },

  logIn: async (username: string, password: string) => {
    const res = await api.post('auth/login', { username, password });

    return res.data;
  },

  logOut: async () => await api.post('auth/logout', { withCredentials: true }),

  fetchMe: async () => {
    const res = await api.get('user/me', { withCredentials: true });

    return res.data?.user;
  },
};
