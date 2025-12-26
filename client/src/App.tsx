import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/MenuPage";
import Cart from "./pages/CartPage";
import Home from "./pages/Home";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Checkout from "./pages/Checkout";
import CheckoutConfirm from "./pages/CheckoutConfirm";
import SuccessPage from "./pages/SuccessPage";
import VNPayReturnPage from "./pages/VNPayReturnPage";
import PaymentFailedPage from "./pages/PaymentFailedPage";
import { InventoryProvider } from "./context/InventoryContext";
import User from "./pages/User";
import WishlistPage from "./pages/Wishlist";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <InventoryProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<User />} />
              <Route path="/checkout/confirm" element={<CheckoutConfirm />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/order-success/:orderId" element={<SuccessPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/payment/vnpay/return"
                element={<VNPayReturnPage />}
              />
              <Route path="/payment-failed" element={<PaymentFailedPage />} />
            </Routes>
          </BrowserRouter>
        </InventoryProvider>
      </CartProvider>
    </AuthProvider>
  );
}
