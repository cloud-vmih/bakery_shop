import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RegisterPage from "./pages/Register";
import Home from "./pages/Home";
import { AuthProvider } from "./context/authContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import VerifyEmail from "./pages/verifyEmail";
import MenuPage from "./pages/MenuPage";
import { Header } from "./components/Header";
import ProfilePage from "./pages/User";
import ProductDetails from "./pages/ProductDetails";
import NearestBranch from "./pages/NearestBranch";
import ChangePassword from "./pages/ChangePassword";
import User from "./pages/User";
import ManageBranch from "./pages/ManageBranch";

export default function AppRoutes() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
    <AuthProvider>  
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/changePW" element={<ChangePassword />}/>
        <Route path="/profile" element={<User />} />
        <Route path="/*" element={<Home />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/nearest-branch" element={<NearestBranch />} />
        <Route path="/branch" element={<ManageBranch />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
    </GoogleOAuthProvider>
  );
}