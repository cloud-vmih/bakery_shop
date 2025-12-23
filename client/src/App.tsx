import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
<<<<<<< HEAD
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import { Header } from "./components/Header";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Checkout from "./pages/Checkout";
import CheckoutConfirm from "./pages/CheckoutConfirm";
import SuccessPage from "./pages/Success";
import VNPayReturnPage from "./pages/VNPayReturnPage";
import PaymentFailedPage from "./pages/PaymentFailedPage";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/confirm" element={<CheckoutConfirm />} />
            <Route path="/order-success/:orderId" element={<SuccessPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/payment/vnpay/return" element={<VNPayReturnPage />} />
            <Route path="/payment-failed" element={<PaymentFailedPage />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
=======
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
        {/*<Route path="/profile" element={<ProfilePage />} />*/}
          <Route path="/admin/menu" element={<MenuManagement />} />
        <Route path="/order" element={<MyOrders />} />
        <Route path="/orderDetails/:orderId" element={<OrderStatus />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/admin/promotion" element={<ItemsDiscountPage />} />
        <Route path="/admin/staff" element={<StaffPage />} />

      </Routes>
    </BrowserRouter>
        </InventoryProvider>
>>>>>>> feature/updateQuantity-v2
    </AuthProvider>
  );
}
