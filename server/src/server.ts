import express from "express";
import cors from "cors";
import userRoutes from "./routes/account.routes";
import itemRoutes from "./routes/item.routes";
import reviewRoutes from "./routes/review.routes";

import categoryRoutes from "./routes/category.routes";
import cartRoutes from "./routes/cart.routes";


import profileRoutes from "./routes/user.routes";
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
app.use("/items", itemRoutes);
app.use('/api', profileRoutes);
app.use('/api/reviews', reviewRoutes);
export default app;