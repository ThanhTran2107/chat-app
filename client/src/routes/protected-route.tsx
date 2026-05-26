import { useAuthStore } from '@/stores/use-auth-store';

import { Navigate, Outlet } from 'react-router';

import { ROUTES } from '@/utils/constants';

export const ProtectedRoute = () => {
  const { accessToken } = useAuthStore();

  if (!accessToken) return <Navigate to={ROUTES.LOGIN} replace />;

  return <Outlet />;
};
