import type { AuthState } from '@/types/store';
import { create } from 'zustand';

import { authService } from '@/utils/services/auth.service';

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  clearState: () => set({ accessToken: null, user: null, loading: false }),

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

  logIn: async (username, password) => {
    try {
      set({ loading: true });

      const { accessToken } = await authService.logIn(username, password);
      set({ accessToken });

      await get().fetchMe();
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  logOut: async () => {
    try {
      get().clearState();
      await authService.logOut();
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  fetchMe: async () => {
    try {
      set({ loading: true });

      const user = await authService.fetchMe();
      set({ user });
    } catch (e) {
      console.error(e);
      set({ user: null, accessToken: null });

      throw e;
    } finally {
      set({ loading: false });
    }
  },
}));
