import express from "express";
import cors from "cors";
import userRoutes from "./routes/account.route";
import categoryRoutes from "./routes/category.route";
import cartRoutes from "./routes/cart.route";
import addressRoutes from "./routes/address.route";

import orderRoutes from "./routes/orders.route";
import paymentRoutes from "./routes/payment.route";

import dotenv from "dotenv";
dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // chỉ định frontend origin
    credentials: true, // cho phép gửi cookie / auth headers
  })
);
app.use(express.json());
app.use("/api/category", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api", userRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

export default app;
