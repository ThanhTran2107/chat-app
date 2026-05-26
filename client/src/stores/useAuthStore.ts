import type { AuthState } from '@/types/store';
import { create } from 'zustand';

import { authService } from '@/utils/services/auth.service';

export const useAuthStore = create<AuthState>(set => ({
  accessToken: null,
  user: null,
  loading: false,

  register: async (username, password, email, lastName, firstName) => {
    try {
      set({ loading: true });

      await authService.register(username, password, email, lastName, firstName);
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      set({ loading: false });
    }
  },
}));
