/* eslint-disable react-hooks/exhaustive-deps */
import { Toaster } from 'sonner';

import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';

import { ChatPage } from './pages/chat-page/chat.page';
import { LoginPage } from './pages/login-page/login.page';
import { RegisterPage } from './pages/register-page/register.page';
import { ProtectedRoute } from './routes/protected-route';
import { useThemeStore } from './stores/use-theme-store';
import { ROUTES } from './utils/constants';

function App() {
  const { isDark, setTheme } = useThemeStore();

  useEffect(() => {
    setTheme(isDark);
  }, [isDark]);

  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.CHAT} element={<ChatPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
