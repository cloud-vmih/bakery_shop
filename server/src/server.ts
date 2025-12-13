import express from "express";
import cors from "cors";
import userRoutes from "./routes/account.routes";
import categoryRoutes from "./routes/category.routes";
import cartRoutes from "./routes/cart.routes";
import wishlistRoutes from "./routes/wishlist.routes";

import dotenv from "dotenv";
dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:3000",  // chỉ định frontend origin
  credentials: true                 // cho phép gửi cookie / auth headers
}));
app.use(express.json());
app.use("/api/category", categoryRoutes);
app.use("/api/cart", cartRoutes);  // Thêm dòng này
app.use("/api", userRoutes);
app.use("/api/wishlist", wishlistRoutes);

export default app;