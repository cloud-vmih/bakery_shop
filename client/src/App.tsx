import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RegisterPage from "./pages/Register";
import Home from "./pages/Home";
import { AuthProvider } from "./context/authContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import VerifyEmail from "./pages/verifyEmail";
import MenuPage from "./pages/MenuPage";
import { Header } from "./components/Header";
import { SocketProvider } from "./context/socketContext";
import ChatBox from "./components/chat/ChatBox";

export default function AppRoutes() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
    <AuthProvider>
      <SocketProvider>
    <BrowserRouter>
      <ChatBox />
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/*" element={<Home />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/menu" element={<MenuPage />} />
      </Routes>
    </BrowserRouter>
    </SocketProvider>
    </AuthProvider>
    </GoogleOAuthProvider>
  );
}
