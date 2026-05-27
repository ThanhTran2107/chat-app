/* eslint-disable react-hooks/exhaustive-deps */
import { useAuthStore } from '@/stores/use-auth-store';
import { Spin } from '@/components/antd/spin.component';

import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';

import { ROUTES } from '@/utils/constants';

export const ProtectedRoute = () => {
  // Get the authentication state and actions from the auth store
  const { accessToken, user, loading, refreshToken, fetchMe } = useAuthStore();
  const [starting, setStarting] = useState(true);

  // On component mount, check if there's an access token. If not, try to refresh it. If there's an access token but no user info, fetch the user info. Finally, set the starting state to false to indicate that the initial checks are done.
  useEffect(() => {
    (async () => {
      if (!accessToken) await refreshToken();
      if (accessToken && !user) await fetchMe();

      setStarting(false);
    })();
  }, []);

  // While loading or starting, show a loading spinner. If there's no access token after the checks, redirect to the login page. Otherwise, render the child routes (protected content).
  if (loading || starting)
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin description="Loading the page..." size="large" />
      </div>
    );

  // If there's no access token, redirect to the login page
  if (!accessToken) return <Navigate to={ROUTES.LOGIN} replace />;

  // If there's an access token, render the child routes (protected content)
  return <Outlet />;
};
