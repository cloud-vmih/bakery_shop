// src/server.ts
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/account.route";
import categoryRoutes from "./routes/category.route";
import cartRoutes from "./routes/cart.route";
import branchRoutes from "./routes/branch.route";
import profileRoutes from "./routes/user.route";
import itemRoutes from "./routes/item.route";
import inventoryRoutes from "./routes/inventory.route";
import addressRoutes from "./routes/address.route";
import orderRoutes from "./routes/order.route";

import ordersRoutes from "./routes/orders.route";
import paymentRoutes from "./routes/payment.route";
import paymentVNPayRoutes from "./routes/payment.vnpay.route";

import manageOrderRoutes from "./routes/manageOrder.route";
import wishlistRoutes from "./routes/wishlist.route";
import messageRouters from "./routes/chat.route";
import dashboardRoutes from "./routes/dashboard.route"; // ← ĐẢM BẢO IMPORT ĐÚNG ĐƯỜNG DẪN
import itemsDiscountRoutes from "./routes/itemsDiscount.route";
import staffRoutes from "./routes/staff.route";
import reviewRoutes from "./routes/review.route";
import membershipDiscountRoutes from "./routes/membershipDiscount.route";

import membershipRoutes from "./routes/mempoint.route";

import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use("/api", categoryRoutes);
app.use("/api/cart", cartRoutes); // Thêm dòng này

// Mount route cụ thể TRƯỚC route chung
app.use("/api/dashboard", dashboardRoutes); // ← PHẢI CÓ DÒNG NÀY, ĐẶT TRƯỚC /api
app.use("/api/manage-orders", manageOrderRoutes);

// Route chung user ĐẶT SAU CÙNG
app.use("/api", userRoutes);
app.use("/api/branchs", branchRoutes);
app.use("/api/items", itemRoutes);
app.use("/api", inventoryRoutes);
//app.use("/api", addressRoutes);
app.use("/api", profileRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/chat", messageRouters);

app.use("/addresses", addressRoutes); // cho FE mới
app.use("/api/addresses", addressRoutes); // cho API cũ / thống nhất

app.use("/api/orders", ordersRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/payment/vnpay", paymentVNPayRoutes);

app.use("/api/items-discount", itemsDiscountRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/promotion", membershipDiscountRoutes);
app.get("/api/__ping", (req, res) => {
  res.send("OK");
});

app.use("/api/membership", membershipRoutes);

// export đặt CUỐI CÙNG
export default app;
