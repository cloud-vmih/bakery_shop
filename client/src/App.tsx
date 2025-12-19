import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RegisterPage from "./pages/Register";
import Home from "./pages/Home";
import { AuthProvider } from "./context/authContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import VerifyEmail from "./pages/verifyEmail";
import Menu from "./pages/Menu";
import { Header } from "./components/Header";
import ProfilePage from "./pages/User";
import MenuManagement from "./pages/MenuManagement";
import ManageReviews from "./pages/review";
import MenuManagement_P from "./pages/ProductUpdate";

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
        <Header />
      <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/*" element={<Home />} />
            <Route path="/verify" element={<VerifyEmail />} />
            <Route path="/M-menu" element={<MenuManagement />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/reviews" element={<ManageReviews />} />
            <Route path="/updateProduct" element={<MenuManagement_P />} />
      </Routes>

        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}