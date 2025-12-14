import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RegisterPage from "./pages/Register";
import Home from "./pages/Home";
import { AuthProvider } from "./context/authContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import VerifyEmail from "./pages/verifyEmail";
import MenuManagement from "./pages/MenuManagement";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
      <AuthProvider>
        <BrowserRouter>

          {/* 🌟 Toast hiển thị toàn bộ app */}
          <ToastContainer
            position="bottom-right"
            autoClose={2000}
            theme="light"
          />

          {/* 🌟 Router */}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/*" element={<Home />} />
            <Route path="/verify" element={<VerifyEmail />} />
            <Route path="/M-menu" element={<MenuManagement />} />
          </Routes>

        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
