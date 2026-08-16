import { useAuthStore } from '@/stores/use-auth-store';
import { toast } from 'sonner';

import { useEffect, useRef, useState } from 'react';

import { useFacebookSDK } from '@/utils/hooks/use-facebook-sdk.hook';

interface FacebookAuthResponse {
  authResponse?: {
    accessToken?: string;
  };
}

export function useFacebookLogin(onSuccess?: () => void) {
  const logInWithFacebook = useAuthStore(state => state.logInWithFacebook);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const facebookReady = useFacebookSDK();
  const facebookRequestTimeout = useRef<number | null>(null);
  const successCallback = useRef<(() => void) | undefined>(onSuccess);

  useEffect(() => {
    successCallback.current = onSuccess;
  }, [onSuccess]);

  const clearFacebookRequestTimeout = () => {
    if (facebookRequestTimeout.current !== null) {
      window.clearTimeout(facebookRequestTimeout.current);
      facebookRequestTimeout.current = null;
    }
  };

  const handleFacebookClick = () => {
    const FB = window.FB;

    if (!FB) {
      toast.error('Facebook login is not ready yet.');
      return;
    }

    clearFacebookRequestTimeout();
    setFacebookLoading(true);
    facebookRequestTimeout.current = window.setTimeout(() => {
      setFacebookLoading(false);
      facebookRequestTimeout.current = null;
    }, 1200);

    FB.login(
      (response: FacebookAuthResponse) => {
        const handleResponse = async () => {
          clearFacebookRequestTimeout();

          if (!response.authResponse?.accessToken) return setFacebookLoading(false);

          try {
            await logInWithFacebook(response.authResponse.accessToken);
            successCallback.current?.();
          } catch (e) {
            console.error('Facebook login error:', e);
            toast.error('Facebook login failed. Please try again.');
          } finally {
            setFacebookLoading(false);
          }
        };

        void handleResponse();
      },
      { scope: 'email,public_profile', return_scopes: true },
    );
  };

  return { facebookReady, facebookLoading, handleFacebookClick };
}
