import { useAuthStore } from '@/stores/use-auth-store';

import { Navigate } from 'react-router';

import { ROUTES } from '@/utils/constants';

// Higher-order component that redirects authenticated users to the chat page, preventing access to login and registration pages
interface RedirectIfAuthenticatedProps {
  children: React.ReactNode;
}

// If the user is authenticated (has an access token), redirect to the chat page; otherwise, render the children components (e.g., login or registration forms)
export const RedirectIfAuthenticated = ({ children }: RedirectIfAuthenticatedProps) => {
  const { accessToken } = useAuthStore();

  if (accessToken) return <Navigate to={ROUTES.CHAT} replace />;

  return <>{children}</>;
};
