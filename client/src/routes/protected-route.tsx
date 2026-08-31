import { appSessionInitPromise, useAuthStore } from '@/stores/use-auth.store';
import { useChatStore } from '@/stores/use-chat.store';
import isEmpty from 'lodash-es/isEmpty';

import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { LoadingSpinner } from '@/components/ui/loading-spinner.component';

import { ROUTES } from '@/utils/constants';

export const ProtectedRoute = () => {
  const [starting, setStarting] = useState(true);
  const [progress, setProgress] = useState(0);

  const accessToken = useAuthStore(state => state.accessToken);
  const loading = useAuthStore(state => state.loading);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      setProgress(0);

      try {
        const authState = useAuthStore.getState();
        const currentAccessToken = authState.accessToken;
        const currentUser = authState.user;
        const chatState = useChatStore.getState();

        if (appSessionInitPromise) await appSessionInitPromise;
        setProgress(33);

        if (!currentAccessToken) return;

        if (!currentUser) await authState.fetchMe();
        setProgress(67);

        if (isEmpty(chatState.conversations) && !chatState.convoLoading) await chatState.fetchConversations();
      } catch (e) {
        console.warn('ProtectedRoute initialization warning:', e);
      } finally {
        if (mounted) {
          setProgress(100);
          setStarting(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [accessToken]);

  if (loading || starting) return <LoadingSpinner description="Securing your connection..." progress={progress} />;

  if (!accessToken) return <Navigate to={ROUTES.LOGIN} replace />;

  return <Outlet />;
};
