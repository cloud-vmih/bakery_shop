// src/server.ts
import express from "express";
import cookieParser from 'cookie-parser';
import cors from "cors";
import userRoutes from "./routes/account.routes";
import categoryRoutes from "./routes/category.routes";
import cartRoutes from "./routes/cart.routes";
import branchRoutes from "./routes/branch.routes"
import profileRoutes from "./routes/user.routes";
import itemRoutes from "./routes/item.routes";
import inventoryRoutes from "./routes/inventory.routes";
import addressRoutes from "./routes/address.routes";
import orderRoutes from "./routes/order.routes"
import manageOrderRoutes from "./routes/manageOrder.routes"
import wishlistRoutes from "./routes/wishlist.routes";import messageRouters from "./routes/chat.routes";
import dashboardRoutes from "./routes/dashboard.routes"; // ← ĐẢM BẢO IMPORT ĐÚNG ĐƯỜNG DẪN

import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use("/api", categoryRoutes);
app.use("/api", cartRoutes);  // Thêm dòng này

// Mount route cụ thể TRƯỚC route chung
app.use("/api/dashboard", dashboardRoutes); // ← PHẢI CÓ DÒNG NÀY, ĐẶT TRƯỚC /api
app.use("/api/manage-orders", manageOrderRoutes);

// Route chung user ĐẶT SAU CÙNG
app.use("/api", userRoutes);
app.use("/api/branchs", branchRoutes);
app.use("/api/items", itemRoutes);
app.use("/api", inventoryRoutes);
app.use("/api", addressRoutes);
app.use('/api', profileRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/chat", messageRouters);

export default app;