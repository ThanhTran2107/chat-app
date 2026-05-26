import { API_ENDPOINTS } from '@/utils/constants';

import { api } from '@/lib/axios';

export const authService = {
  register: async (username: string, password: string, email: string, lastName: string, firstName: string) => {
    const res = await api.post(API_ENDPOINTS.AUTH_REGISTER, { username, password, email, lastName, firstName });

    return res.data;
  },
};
