import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import userRoutes from "./routes/account.routes";
import itemsDiscountRoutes from "./routes/itemsDiscount.routes";
import staffRoutes from "./routes/staff.routes";

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());

// Đăng ký routes
app.use("/api", userRoutes);
app.use("/api/items-discount", itemsDiscountRoutes);
app.use("/api/staff", staffRoutes);

// export đặt CUỐI CÙNG
export default app;
