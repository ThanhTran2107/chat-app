import { appSessionInitPromise, useAuthStore } from '@/stores/use-auth.store';
import { useChatStore } from '@/stores/use-chat.store';

import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { Spin } from '@/components/antd/spin.component';

import { ROUTES } from '@/utils/constants';

export const ProtectedRoute = () => {
  const [starting, setStarting] = useState(true);

  const accessToken = useAuthStore(state => state.accessToken);
  const loading = useAuthStore(state => state.loading);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const authState = useAuthStore.getState();
        const currentAccessToken = authState.accessToken;
        const currentUser = authState.user;
        const chatState = useChatStore.getState();

        if (appSessionInitPromise) await appSessionInitPromise;

        if (!currentAccessToken) return;

        if (!currentUser) await authState.fetchMe();

        if (!chatState.conversations.length && !chatState.convoLoading) await chatState.fetchConversations();
      } catch (e) {
        console.warn('ProtectedRoute initialization warning:', e);
      } finally {
        if (mounted) setStarting(false);
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [accessToken]);

  if (loading || starting)
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin description="Loading the page..." size="large" />
      </div>
    );

  if (!accessToken) return <Navigate to={ROUTES.LOGIN} replace />;

  return <Outlet />;
};
