import { Toaster } from 'sonner';

import { BrowserRouter, Route, Routes } from 'react-router';

import { ChatPage } from './pages/chat.page';
import { LoginPage } from './pages/login.page';
import { RegisterPage } from './pages/register.page';
import { ROUTES } from './utils/constants';

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.CHAT} element={<ChatPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
