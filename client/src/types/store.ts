import type { User } from './user.ts';

// Types for the authentication state managed by Zustand
export interface AuthState {
  accessToken: string | null; // JWT access token for authenticated requests, null when not logged in
  user: User | null; // User type imported from user.ts, can be null when not logged in
  loading: boolean; // Indicates if an authentication-related operation is in progress

  // Action functions to update the authentication state
  clearState: () => void;
  setAccessToken: (token: string) => void;

  // Asynchronous actions for authentication operations
  register: (username: string, password: string, email: string, lastName: string, firstName: string) => Promise<void>;
  logIn: (username: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  fetchMe: () => Promise<void>;
  refreshToken: () => Promise<void>;
}
