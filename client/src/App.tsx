import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RegisterPage from "./pages/Register";
import Home from "./pages/Home";
import VerifyEmail from "./pages/verifyEmail";
import OrderManagement from "./pages/OrderManagement";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/authContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function AppRoutes() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify" element={<VerifyEmail />} />
               {/* Route chỉ dành cho staff & admin */}
            <Route path="/admin/orders" element={<OrderManagement />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />

            {/* Trang chính sau khi login */}
            <Route path="/*" element={<Home />} />

         
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}