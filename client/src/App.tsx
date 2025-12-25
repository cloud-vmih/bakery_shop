import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RegisterPage from "./pages/Register";
import Home from "./pages/Home";
import { AuthProvider } from "./context/authContext";
import { InventoryProvider} from "./context/inventoryContext";
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
        <Route path="/profile" element={<User />} />
        <Route path="/*" element={<Home />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/nearest-branch" element={<NearestBranch />} />
        <Route path="/admin/branch" element={<ManageBranch />} />
          <Route path="/admin/menu" element={<MenuManagement />} />
        <Route path="/order" element={<MyOrders />} />
        <Route path="/orderDetails/:orderId" element={<OrderStatus />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/admin/promotion" element={<ItemsDiscountPage />} />
        <Route path="/admin/staff" element={<StaffPage />} />
          <Route path="/admin/reviews" element={<ManageReviews />} />
          <Route path="/membership" element={<MembershipPoints />} />
      </Routes>
    </BrowserRouter>
        </InventoryProvider>
    </AuthProvider>
    </GoogleOAuthProvider>
  );
}
