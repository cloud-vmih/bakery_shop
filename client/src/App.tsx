import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
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
    </AuthProvider>
  );
}
