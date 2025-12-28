import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RegisterPage from "./pages/Register";
import Cart from "./pages/CartPage";
import Home from "./pages/Home";
import VerifyEmail from "./pages/verifyEmail";
import OrderManagement from "./pages/OrderManagement";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import { InventoryProvider } from "./context/InventoryContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CartProvider } from "./context/CartContext";
import Checkout from "./pages/Checkout";
import CheckoutConfirm from "./pages/CheckoutConfirm";
import SuccessPage from "./pages/SuccessPage";
import VNPayReturnPage from "./pages/VNPayReturnPage";
import PaymentFailedPage from "./pages/PaymentFailedPage";
import MenuPage from "./pages/MenuPage";
import ChangePassword from "./pages/ChangePassword";
import ProductDetails from "./pages/ProductDetails";
import NearestBranch from "./pages/NearestBranch";
import User from "./pages/User"; // cho admin & staff
import ProfilePage from "./pages/Profile"; // cho cus
import ManageBranch from "./pages/ManageBranch";
import MenuManagement from "./pages/MenuManagement";
import MyOrders from "./pages/MyOrders";
import OrderStatus from "./pages/OrderStatus";
import WishlistPage from "./pages/Wishlist";
import ItemsDiscountPage from "./pages/ItemsDiscountPage";
import StaffPage from "./pages/Staff";
import ManageReviews from "./pages/review";
import MembershipPoints from "./pages/MembershipPoints";
import { AdminLayout } from "./layout/AdminLayout";
import { MainLayout } from "./layout/CustomerLayout";


import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SocketProvider } from "./context/SocketContext";

import AdminConversationChat from "./components/chat/AdminConversationChat";
import AdminConversationList from "./components/chat/AdminConversationList";

export default function App() {
    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
            <AuthProvider>
                <SocketProvider>
                    <CartProvider>
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
                                    <Route path="/verify" element={<VerifyEmail />} />

                                    {/* Trang chính sau khi login */}
                                    <Route path="/change-password" element={<ChangePassword />} />
                                    <Route element={<MainLayout />}>
                                        <Route path="/profile" element={<ProfilePage/>} />
                                        <Route path="/*" element={<Home />} />
                                        <Route path="/verify" element={<VerifyEmail />} />
                                        <Route path="/menu" element={<MenuPage />} />
                                        <Route path="/product/:id" element={<ProductDetails />} />
                                        <Route path="/nearest-branch" element={<NearestBranch />} />
                                        <Route path="/membership" element={<MembershipPoints />} />
                                        <Route path="/order" element={<MyOrders />} />
                                        <Route
                                            path="/orderDetails/:orderId"
                                            element={<OrderStatus />}
                                        />
                                        <Route path="/wishlist" element={<WishlistPage />} />
                                        <Route path="/" element={<Home />} />
                                        <Route path="/cart" element={<Cart />} />
                                        <Route path="/checkout" element={<Checkout />} />
                                        <Route
                                            path="/checkout/confirm"
                                            element={<CheckoutConfirm />}
                                        />
                                        <Route
                                            path="/order-success/:orderId"
                                            element={<SuccessPage />}
                                        />
                                        <Route
                                            path="/payment/vnpay/return"
                                            element={<VNPayReturnPage />}
                                        />
                                        <Route
                                            path="/payment-failed"
                                            element={<PaymentFailedPage />}
                                        />
                                    </Route>
                                    <Route path="/admin" element={<AdminLayout />}>
                                        <Route index element={<Dashboard />} />
                                        <Route path="branch" element={<ManageBranch />} />
                                        <Route path="menu" element={<MenuManagement />} />
                                        <Route path="promotion" element={<ItemsDiscountPage />} />
                                        <Route path="staff" element={<StaffPage />} />
                                        <Route path="reviews" element={<ManageReviews />} />
                                        <Route
                                            path="/admin/manage-orders"
                                            element={<OrderManagement />}
                                        />
                                        <Route path="/profile" element={<User />} />
                                    </Route>
                                </Routes>
                            </BrowserRouter>
                        </InventoryProvider>
                    </CartProvider>
                </SocketProvider>
            </AuthProvider>
        </GoogleOAuthProvider>
    );
}