/* eslint-disable react-hooks/exhaustive-deps */
import { Toaster } from 'sonner';

import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { LoadingSpinner } from '@/components/ui/loading-spinner.component';

import { ProtectedRoute } from './routes/protected-route';
import { RedirectIfAuthenticated } from './routes/redirect-if-authenticated';
import { useAuthStore } from './stores/use-auth.store';
import { useSocketStore } from './stores/use-socket.store';
import { useThemeStore } from './stores/use-theme.store';
import { AUTH_SESSION_VALUE, LOCAL_STORAGE_KEYS, ROUTES } from './utils/constants';

const ChatPage = lazy(() => import('./pages/chat-page/chat.page').then(m => ({ default: m.ChatPage })));
const ForgotPasswordPage = lazy(() =>
  import('./pages/forgot-password-page/forgot-password.page').then(m => ({ default: m.ForgotPasswordPage })),
);
const LandingPage = lazy(() => import('./pages/landing-page/landing.page').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('./pages/login-page/login.page').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/register-page/register.page').then(m => ({ default: m.RegisterPage })));
const ResendVerificationPage = lazy(() =>
  import('./pages/resend-verification-page/resend-verification.page').then(m => ({
    default: m.ResendVerificationPage,
  })),
);
const ResetPasswordPage = lazy(() =>
  import('./pages/reset-password-page/reset-password.page').then(m => ({ default: m.ResetPasswordPage })),
);
const VerifyEmailPage = lazy(() =>
  import('./pages/verify-email-page/verify-email.page').then(m => ({ default: m.VerifyEmailPage })),
);

function App() {
  const isDark = useThemeStore(state => state.isDark);
  const setTheme = useThemeStore(state => state.setTheme);
  const accessToken = useAuthStore(state => state.accessToken);
  const refreshToken = useAuthStore(state => state.refreshToken);
  const connectSocket = useSocketStore(state => state.connectSocket);
  const disconnectSocket = useSocketStore(state => state.disconnectSocket);

  useEffect(() => {
    setTheme(isDark);
  }, [isDark]);

  useEffect(() => {
    const initializeAuth = async () => {
      const hasSession = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_SESSION) === AUTH_SESSION_VALUE;

      if (hasSession) {
        const { refreshToken } = useAuthStore.getState();
        refreshToken();
      }
    };

    initializeAuth();
  }, [refreshToken]);

  useEffect(() => {
    if (accessToken) connectSocket();

    return () => disconnectSocket();
  }, [accessToken]);

  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route
              path="/"
              element={
                <RedirectIfAuthenticated>
                  <LandingPage />
                </RedirectIfAuthenticated>
              }
            />
            <Route
              path={ROUTES.LOGIN}
              element={
                <RedirectIfAuthenticated>
                  <LoginPage />
                </RedirectIfAuthenticated>
              }
            />
            <Route
              path={ROUTES.REGISTER}
              element={
                <RedirectIfAuthenticated>
                  <RegisterPage />
                </RedirectIfAuthenticated>
              }
            />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
            <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
            <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />
            <Route path={ROUTES.RESEND_VERIFICATION} element={<ResendVerificationPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path={ROUTES.CHAT} element={<ChatPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
