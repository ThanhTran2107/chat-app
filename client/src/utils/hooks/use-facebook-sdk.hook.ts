import { useEffect, useState } from 'react';

import { AUTH_ID } from '@/utils/constants';

declare global {
  interface Window {
    FB?: {
      init: (config: { appId: string; cookie: boolean; xfbml: boolean; version: string }) => void;
      login: (...args: unknown[]) => void;
    };
    fbAsyncInit?: () => void;
  }
}

export function useFacebookSDK() {
  const [isFacebookReady, setFacebookReady] = useState(() => {
    if (typeof window === 'undefined') return false;
    return Boolean(window.FB);
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.FB) return;

    const existingScript = document.querySelector('script[src="https://connect.facebook.net/en_US/sdk.js"]');

    if (existingScript) {
      existingScript.addEventListener('load', () => {
        if (window.FB) {
          window.FB.init({
            appId: AUTH_ID.FACEBOOK_APP_ID,
            cookie: true,
            xfbml: false,
            version: 'v17.0',
          });
          setFacebookReady(true);
        }
      });

      existingScript.addEventListener('error', () => console.error('Facebook SDK failed to load'));

      return;
    }

    window.fbAsyncInit = () => {
      if (window.FB) {
        window.FB.init({
          appId: AUTH_ID.FACEBOOK_APP_ID,
          cookie: true,
          xfbml: false,
          version: 'v17.0',
        });
        setFacebookReady(true);
      }
    };

    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.FB) {
        window.FB.init({
          appId: AUTH_ID.FACEBOOK_APP_ID,
          cookie: true,
          xfbml: false,
          version: 'v17.0',
        });

        setFacebookReady(true);
      }
    };

    script.onerror = () => console.error('Facebook SDK failed to load');

    document.body.appendChild(script);

    return undefined;
  }, []);

  return isFacebookReady;
}
