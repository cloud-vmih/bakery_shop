import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RegisterPage from "./pages/Register";
import Home from "./pages/Home";
import { AuthProvider } from "./context/authContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import VerifyEmail from "./pages/verifyEmail";
import MenuPage from "./pages/MenuPage";
import { Header } from "./components/Header";
<<<<<<<<< Temporary merge branch 1
import ProfilePage from "./pages/User";
=========
import ProductDetails from "./pages/ProductDetails";
import NearestBranch from "./pages/NearestBranch";
>>>>>>>>> Temporary merge branch 2

export default function AppRoutes() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
    <AuthProvider>  
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/changePW" element={<ChangePassword />}/>
        <Route path="/*" element={<Home />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/nearest-branch" element={<NearestBranch />} />
>>>>>>>>> Temporary merge branch 2
      </Routes>
    </BrowserRouter>
    </AuthProvider>
    </GoogleOAuthProvider>
  );
}