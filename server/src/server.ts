import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/account.route";
import categoryRoutes from "./routes/category.route";
import cartRoutes from "./routes/cart.route";
import addressRoutes from "./routes/address.route";

import orderRoutes from "./routes/orders.route";
import paymentRoutes from "./routes/payment.route";
import paymentVNPayRoutes from "./routes/payment.vnpay.route";

import inventoryRoutes from "./routes/inventory.route";
import branchRoutes from "./routes/branch.route";

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

// =====================
// ROUTES
// =====================
app.use("/api", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api", userRoutes);

// 🔥 ADDRESS ROUTES (THÊM DÒNG NÀY)
app.use("/addresses", addressRoutes); // cho FE mới
app.use("/api/addresses", addressRoutes); // cho API cũ / thống nhất

app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/payment/vnpay", paymentVNPayRoutes);

app.use("/api", inventoryRoutes);

app.use("/api/branchs", branchRoutes);

export default app;
