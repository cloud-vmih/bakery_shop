// src/server.ts
import express from "express";
import cors from "cors";
import userRoutes from "./routes/account.routes";
import orderRoutes from "./routes/order.routes";
import dashboardRoutes from "./routes/dashboard.routes"; // ← ĐẢM BẢO IMPORT ĐÚNG ĐƯỜNG DẪN

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Mount route cụ thể TRƯỚC route chung
app.use("/api/dashboard", dashboardRoutes); // ← PHẢI CÓ DÒNG NÀY, ĐẶT TRƯỚC /api
app.use("/api/orders", orderRoutes);

// Route chung user ĐẶT SAU CÙNG
app.use("/api", userRoutes);

export default app;