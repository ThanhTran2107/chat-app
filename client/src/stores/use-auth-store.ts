import { useChatStore } from '@/stores/use-chat-store';
import { useFriendStore } from '@/stores/use-friend-store';
import { useSocketStore } from '@/stores/use-socket-store';
import type { AuthState } from '@/types/store.type';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { LOCAL_STORAGE_KEYS } from '@/utils/constants';
// Zustand library for state management

import { authService } from '@/utils/services/auth.service';

let fetchMePromise: Promise<void> | null = null;
let refreshTokenPromise: Promise<void> | null = null;
export let appSessionInitPromise: Promise<void> | null = null;

const { AUTH_STORAGE, CHAT_STORAGE, AUTH_SESSION } = LOCAL_STORAGE_KEYS;

// Zustand store for managing authentication state and actions
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      const finalizeLogin = async (accessToken: string) => {
        get().setAccessToken(accessToken);
        localStorage.setItem(AUTH_SESSION, '1');

        await get().fetchMe();
        await useChatStore.getState().fetchConversations();
      };

      return {
        // Initial state values for authentication
        accessToken: null,
        user: null,
        loading: false,

        clearState: () => {
          useSocketStore.getState().disconnectSocket();
          set({ accessToken: null, user: null, loading: false });
          useChatStore.getState().reset();
          useFriendStore.getState().reset();
          sessionStorage.clear();
          localStorage.removeItem(AUTH_STORAGE);
          localStorage.removeItem(CHAT_STORAGE);
          localStorage.removeItem(AUTH_SESSION);
        }, // Reset the authentication state to its initial values
        setAccessToken: token => set({ accessToken: token }), // Update the access token in the state
        setUser: user => set({ user }),

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
        logIn: async (email, password) => {
          try {
            get().clearState();
            set({ loading: true });

            const { accessToken } = await authService.logIn(email, password);
            await finalizeLogin(accessToken);
          } catch (e) {
            console.error('Login error:', e);
            throw e;
          } finally {
            set({ loading: false });
          }
        },

        // Log in using Google access token
        logInWithGoogle: async accessToken => {
          try {
            get().clearState();
            set({ loading: true });

            const { accessToken: token } = await authService.logInWithGoogle(accessToken);
            await finalizeLogin(token);
          } catch (e) {
            console.error('Google login error:', e);
            throw e;
          } finally {
            set({ loading: false });
          }
        },

        // Log in using Facebook access token
        logInWithFacebook: async accessToken => {
          try {
            get().clearState();
            set({ loading: true });

            const { accessToken: token } = await authService.logInWithFacebook(accessToken);
            await finalizeLogin(token);
          } catch (e) {
            console.error('Facebook login error:', e);
            throw e;
          } finally {
            set({ loading: false });
          }
        },

        // Clear the authentication state and log out the user
        logOut: async () => {
          try {
            await authService.logOut();
            get().clearState();
          } catch (e) {
            console.error('Logout error:', e);
            throw e;
          }
        },

        // Fetch the current user's information
        fetchMe: async () => {
          if (fetchMePromise) return fetchMePromise;

          fetchMePromise = (async () => {
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
              fetchMePromise = null;
            }
          })();

          return fetchMePromise;
        },

        // Refresh the access token using the refresh token stored in cookies
        refreshToken: async () => {
          if (refreshTokenPromise) return refreshTokenPromise;

          refreshTokenPromise = (async () => {
            appSessionInitPromise = refreshTokenPromise;

            try {
              set({ loading: true });
              const { user, fetchMe, setAccessToken } = get();
              const accessToken = await authService.refreshToken();

              if (!accessToken) return get().clearState();

              localStorage.setItem(AUTH_SESSION, '1');
              setAccessToken(accessToken);

              if (!user) await fetchMe();

              await useChatStore.getState().fetchConversations();
            } catch (e) {
              console.warn('Refresh token failed:', e);
              get().clearState();
            } finally {
              set({ loading: false });
              refreshTokenPromise = null;
              appSessionInitPromise = null;
            }
          })();

          return refreshTokenPromise;
        },
      };
    },
    { name: AUTH_STORAGE, partialize: state => ({ user: state.user }) },
  ),
);
