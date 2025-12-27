import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RegisterPage from "./pages/Register";
import Home from "./pages/Home";
import { AuthProvider } from "./context/AuthContext";
import { InventoryProvider} from "./context/InventoryContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import VerifyEmail from "./pages/verifyEmail";
import MenuPage from "./pages/MenuPage";
import ChangePassword from "./pages/ChangePassword";
import ProductDetails from "./pages/ProductDetails";
import NearestBranch from "./pages/NearestBranch";
import User from "./pages/User";
import ManageBranch from "./pages/ManageBranch";
import MenuManagement from "./pages/MenuManagement";
import MyOrders from "./pages/MyOrders";
import OrderStatus from "./pages/OrderStatus";
import WishlistPage from "./pages/Wishlist";
import ItemsDiscountPage from "./pages/ItemsDiscountPage";
import StaffPage from "./pages/Staff";
import ManageReviews from "./pages/review";
import MembershipPoints from "./pages/MembershipPoints";
import { AdminLayout } from './layout/AdminLayout';
import { MainLayout } from './layout/CustomerLayout';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
    <AuthProvider>
        <InventoryProvider>
    <BrowserRouter>
        <ToastContainer
            position="bottom-right"
            autoClose={2000}
            theme="light"
        />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/changePW" element={<ChangePassword />}/>
          <Route element={<MainLayout />}>
        <Route path="/profile" element={<User />} />
        <Route path="/*" element={<Home />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/nearest-branch" element={<NearestBranch />} />
              <Route path="/membership" element={<MembershipPoints />} />
              <Route path="/order" element={<MyOrders />} />
              <Route path="/orderDetails/:orderId" element={<OrderStatus />} />
              <Route path="/wishlist" element={<WishlistPage />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
              {/*<Route index element={<Dashboard />} />*/}
              <Route path="branch" element={<ManageBranch />} />
              <Route path="menu" element={<MenuManagement />} />
              <Route path="promotion" element={<ItemsDiscountPage />} />
              <Route path="staff" element={<StaffPage />} />
              <Route path="reviews" element={<ManageReviews />} />
          </Route>
      </Routes>
    </BrowserRouter>
        </InventoryProvider>
    </AuthProvider>
    </GoogleOAuthProvider>
  );
}
