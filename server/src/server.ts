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


import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",  // chỉ định frontend origin
  credentials: true                 // cho phép gửi cookie / auth headers
}));
app.use(express.json());
app.use("/api", categoryRoutes);
app.use("/api", cartRoutes);  // Thêm dòng này
app.use("/api", userRoutes);
app.use("/api/branchs", branchRoutes);
app.use("/api/items", itemRoutes);
app.use("/api", inventoryRoutes);
app.use("/api", addressRoutes);
app.use('/api', profileRoutes);
app.use("/api", orderRoutes);

export default app;