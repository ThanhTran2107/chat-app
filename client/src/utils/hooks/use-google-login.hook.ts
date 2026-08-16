import { useAuthStore } from '@/stores/use-auth-store';
import { toast } from 'sonner';

import { useEffect, useRef, useState } from 'react';

import { AUTH_ID } from '@/utils/constants';

interface GoogleTokenResponse {
  access_token?: string;
  error?: string;
}

interface GoogleTokenClient {
  requestAccessToken: (options?: { prompt?: string }) => void;
}

interface GoogleAccounts {
  oauth2?: {
    initTokenClient: (config: {
      client_id: string;
      scope: string;
      callback: (response: GoogleTokenResponse) => void;
    }) => GoogleTokenClient;
  };
}

declare global {
  interface Window {
    google?: { accounts?: GoogleAccounts };
  }
}

export function useGoogleLogin(onSuccess?: () => void) {
  const logInWithGoogle = useAuthStore(state => state.logInWithGoogle);
  const [googleReady, setGoogleReady] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleTokenClient = useRef<GoogleTokenClient | null>(null);
  const googleRequestTimeout = useRef<number | null>(null);
  const successCallback = useRef<(() => void) | undefined>(onSuccess);

  const clearGoogleRequestTimeout = () => {
    if (googleRequestTimeout.current !== null) {
      window.clearTimeout(googleRequestTimeout.current);
      googleRequestTimeout.current = null;
    }
  };

  useEffect(() => {
    successCallback.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadGoogleSdk = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.google?.accounts?.oauth2) return resolve();

        const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
        if (existingScript) {
          existingScript.addEventListener('load', () => resolve());
          existingScript.addEventListener('error', () => reject(new Error('Google SDK failed to load')));
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Google SDK failed to load'));
        document.body.appendChild(script);
      });
    };

    const initGoogle = () => {
      const google = window.google;
      if (!google?.accounts?.oauth2 || googleTokenClient.current) return;

      googleTokenClient.current = google.accounts.oauth2.initTokenClient({
        client_id: AUTH_ID.GOOGLE_CLIENT_ID,
        scope: 'openid email profile',
        callback: async response => {
          clearGoogleRequestTimeout();

          if (response.error) {
            if (response.error === 'popup_closed_by_user') {
              toast.error('Google login was cancelled.');
            } else {
              toast.error('Google login failed. Please try again.');
            }

            setGoogleLoading(false);
            return;
          }

          if (!response.access_token) {
            toast.error('Google login did not return an access token.');
            setGoogleLoading(false);
            return;
          }

          try {
            await logInWithGoogle(response.access_token);
            successCallback.current?.();
          } catch (e) {
            console.error('Google login error:', e);
            toast.error('Google login failed. Please try again.');
          } finally {
            setGoogleLoading(false);
          }
        },
      });

      setGoogleReady(true);
    };

    loadGoogleSdk()
      .then(initGoogle)
      .catch(error => {
        console.error('Google SDK error:', error);
      });
  }, [logInWithGoogle]);

  const handleGoogleClick = () => {
    if (!googleTokenClient.current) {
      toast.error('Google login is not ready yet.');
      return;
    }

    clearGoogleRequestTimeout();
    setGoogleLoading(true);
    googleRequestTimeout.current = window.setTimeout(() => {
      setGoogleLoading(false);
      googleRequestTimeout.current = null;
    }, 1200);

    googleTokenClient.current.requestAccessToken();
  };

  return { googleReady, googleLoading, handleGoogleClick };
}
