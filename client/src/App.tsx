import { Toaster } from 'sonner';

import { BrowserRouter, Route, Routes } from 'react-router';

import { ChatPage } from './pages/chat.page';
import { LoginPage } from './pages/login.page';
import { RegisterPage } from './pages/register.page';

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
