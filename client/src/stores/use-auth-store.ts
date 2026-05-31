import { useChatStore } from '@/stores/use-chat-store';
import type { AuthState } from '@/types/store';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Zustand library for state management

import { authService } from '@/utils/services/auth.service';

// Zustand store for managing authentication state and actions
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state values for authentication
      accessToken: null,
      user: null,
      loading: false,

      clearState: () => {
        set({ accessToken: null, user: null, loading: false });
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('chat-storage');
        useChatStore.getState().reset();
      }, // Reset the authentication state to its initial values
      setAccessToken: token => set({ accessToken: token }), // Update the access token in the state

      // Register a new user
      register: async (username, password, email, lastName, firstName) => {
        try {
          set({ loading: true });

          await authService.register(username, password, email, lastName, firstName);
        } catch (e) {
          console.error('Registration error:', e);
          throw e;
        } finally {
          set({ loading: false });
        }
      },

      // Log in an existing user and return the access token
      logIn: async (username, password) => {
        try {
          set({ loading: true });

          localStorage.removeItem('auth-storage');
          localStorage.removeItem('chat-storage');
          useChatStore.getState().reset();

          const { accessToken } = await authService.logIn(username, password);
          get().setAccessToken(accessToken);

          await get().fetchMe();
          await useChatStore.getState().fetchConversations();
        } catch (e) {
          console.error('Login error:', e);
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
          console.error('Logout error:', e);
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
          console.error('Fetch user error:', e);
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
          console.error('Refresh token error:', e);
          get().clearState();

          throw e;
        } finally {
          set({ loading: false });
        }
      },
    }),
    { name: 'auth-storage', partialize: state => ({ user: state.user }) },
  ),
);
