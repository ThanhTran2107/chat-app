import type { AuthState } from '@/types/store';
import { create } from 'zustand';

// Zustand library for state management

import { authService } from '@/utils/services/auth.service';

// Zustand store for managing authentication state and actions
export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state values for authentication
  accessToken: null,
  user: null,
  loading: false,

  clearState: () => set({ accessToken: null, user: null, loading: false }), // Reset the authentication state to its initial values
  setAccessToken: token => set({ accessToken: token }), // Update the access token in the state

  // Register a new user
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

  // Log in an existing user and return the access token
  logIn: async (username, password) => {
    try {
      set({ loading: true });

      const { accessToken } = await authService.logIn(username, password);
      get().setAccessToken(accessToken);

      await get().fetchMe();
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  // Clear the authentication state and log out the user
  logOut: async () => {
    try {
      get().clearState();
      await authService.logOut();
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  // Fetch the current user's information
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

  // Refresh the access token using the refresh token stored in cookies
  refreshToken: async () => {
    try {
      set({ loading: true });
      const { user, fetchMe, setAccessToken } = get();
      const accessToken = await authService.refreshToken();

      setAccessToken(accessToken);

      if (!user) await fetchMe();
    } catch (e) {
      console.error(e);
      get().clearState();

      throw e;
    } finally {
      set({ loading: false });
    }
  },
}));
