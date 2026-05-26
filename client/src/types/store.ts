import type { User } from './user.ts';

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;

  register: (username: string, password: string, email: string, lastName: string, firstName: string) => Promise<void>;
}
