import { appSessionInitPromise, useAuthStore } from '@/stores/use-auth.store';
import { useChatStore } from '@/stores/use-chat.store';
import isEmpty from 'lodash-es/isEmpty';

import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { LoadingSpinner } from '@/components/ui/loading-spinner.component';

import { ROUTES } from '@/utils/constants';

// Minimum time (ms) each progress step stays visible so the bar never jumps straight to 100% in one React batch
const PROGRESS_STEP_DELAY = 50;

const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

export const ProtectedRoute = () => {
  const [starting, setStarting] = useState(true);
  const [progress, setProgress] = useState(0);

  const accessToken = useAuthStore(state => state.accessToken);
  const loading = useAuthStore(state => state.loading);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      const chatPageImportPromise = import('@/pages/chat-page/chat.page');

      // Early exit: if data is already loaded (e.g. first login completed finalizeLogin),
      // skip the full init sequence — just ensure the chunk is ready then release
      const { accessToken: token, user } = useAuthStore.getState();
      const { conversations, convoLoading } = useChatStore.getState();
      if (token && user && !isEmpty(conversations) && !convoLoading) {
        await chatPageImportPromise;

        if (mounted) setProgress(100);
        // Spinner releases via onProgressComplete → CSS transitionEnd (duration-150ms)
        return;
      }

      try {
        await wait(PROGRESS_STEP_DELAY);
        setProgress(0);

        // Re-read state after each await instead of capturing once - accessToken/user/conversations
        // may change mid-flight (e.g. a background refreshToken() finishing during this same run)
        if (appSessionInitPromise) await appSessionInitPromise;
        setProgress(33);
        await wait(PROGRESS_STEP_DELAY);

        const currentAccessToken = useAuthStore.getState().accessToken;
        if (!currentAccessToken) return;

        if (!useAuthStore.getState().user) await useAuthStore.getState().fetchMe();
        setProgress(67);
        await wait(PROGRESS_STEP_DELAY);

        // If conversations are empty or a fetch is in-flight, ensure we wait for data
        // (fetchConversations has de-duplication: returns the in-flight promise if already running)
        const chatState = useChatStore.getState();
        if (isEmpty(chatState.conversations) || chatState.convoLoading) await chatState.fetchConversations();

        // Wait for the ChatPage lazy chunk too, so 100% means the UI is actually ready to paint,
        // not just that auth/data are ready (avoids a silent gap while Suspense loads the chunk)
        await chatPageImportPromise;
      } catch (e) {
        console.warn('ProtectedRoute initialization warning:', e);
      } finally {
        // Data is ready — show progress bar animating to 100%
        // (spinner releases via onProgressComplete → CSS transitionEnd, duration-150ms)
        if (mounted) setProgress(100);
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
    // Run once per mount: this flow itself awaits appSessionInitPromise / fetchMe with fresh reads,
    // so re-running on every accessToken change would restart the animation and re-show the spinner
  }, []);

  if (loading || starting)
    return (
      <LoadingSpinner
        description="Securing your connection..."
        progress={progress}
        onProgressComplete={() => setStarting(false)}
      />
    );

  if (!accessToken) return <Navigate to={ROUTES.LOGIN} replace />;

  return <Outlet />;
};
