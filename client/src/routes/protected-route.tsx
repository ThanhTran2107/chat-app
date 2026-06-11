import { useAuthStore } from '@/stores/use-auth-store';
import { useChatStore } from '@/stores/use-chat-store';

import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { Spin } from '@/components/antd/spin.component';

import { ROUTES } from '@/utils/constants';

let protectedRouteInitPromise: Promise<void> | null = null;

export const ProtectedRoute = () => {
  const [starting, setStarting] = useState(true);

  // Get the authentication state and actions from the auth store
  const { accessToken, loading, refreshToken, fetchMe } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const hasSession = localStorage.getItem('auth-session') === '1';

        if (!accessToken && hasSession) await refreshToken();

        const authState = useAuthStore.getState();
        const currentAccessToken = authState.accessToken;
        const currentUser = authState.user;
        const chatState = useChatStore.getState();

        if (currentAccessToken && !currentUser) await fetchMe();
        if (currentAccessToken && !chatState.convoLoading) await chatState.fetchConversations();
      } catch (e) {
        console.warn('ProtectedRoute initialization warning:', e);
      } finally {
        if (mounted) setStarting(false);
      }
    };

    if (!protectedRouteInitPromise) {
      protectedRouteInitPromise = initializeAuth();
    } else {
      protectedRouteInitPromise.finally(() => {
        if (mounted) setStarting(false);
      });
    }

    return () => {
      mounted = false;
    };
  }, [accessToken, fetchMe, refreshToken]);

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
