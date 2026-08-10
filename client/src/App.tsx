/* eslint-disable react-hooks/exhaustive-deps */
import { Toaster } from 'sonner';

import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ChatPage } from './pages/chat-page/chat.page';
import { ForgotPasswordPage } from './pages/forgot-password-page/forgot-password.page';
import { LandingPage } from './pages/landing-page/landing.page';
import { LoginPage } from './pages/login-page/login.page';
import { RegisterPage } from './pages/register-page/register.page';
import { ResendVerificationPage } from './pages/resend-verification-page/resend-verification.page';
import { ResetPasswordPage } from './pages/reset-password-page/reset-password.page';
import { VerifyEmailPage } from './pages/verify-email-page/verify-email.page';
import { ProtectedRoute } from './routes/protected-route';
import { RedirectIfAuthenticated } from './routes/redirect-if-authenticated';
import { useAuthStore } from './stores/use-auth-store';
import { useSocketStore } from './stores/use-socket-store';
import { useThemeStore } from './stores/use-theme-store';
import { LOCAL_STORAGE_KEYS, ROUTES } from './utils/constants';

function App() {
  const { isDark, setTheme } = useThemeStore();
  const { accessToken, refreshToken } = useAuthStore();
  const { connectSocket, disconnectSocket } = useSocketStore();

  useEffect(() => {
    setTheme(isDark);
  }, [isDark]);

  useEffect(() => {
    const initializeAuth = async () => {
      const hasSession = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_SESSION) === '1';

      if (hasSession) await refreshToken();
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
      </BrowserRouter>
    </>
  );
}

export default App;
