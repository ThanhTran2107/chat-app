import { BrowserRouter, Routes, Route } from "react-router";
import { LoginPage } from "./pages/login.page";
import { RegisterPage } from "./pages/register.page";
import { ChatPage } from "./pages/chat.page";
import { Toaster } from "sonner";

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
