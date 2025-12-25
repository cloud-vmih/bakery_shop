console.log(">>> SERVER.TS LOADED");

import express from "express";
import cors from "cors";
import userRoutes from "./routes/account.routes";
import categoryRoutes from "./routes/category.routes";
import cartRoutes from "./routes/cart.routes";
import itemsDiscountRoutes from "./routes/itemsDiscount.routes";
import staffRoutes from "./routes/staff.routes";
import membershipDiscountRoutes from "./routes/membershipDiscount.routes";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());
app.use("/api/category", categoryRoutes);
app.use("/api/cart", cartRoutes);  // Thêm dòng này
app.use("/api", userRoutes);
app.use("/api/items-discount", itemsDiscountRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/promotion", membershipDiscountRoutes);
app.get("/api/__ping", (req, res) => {
  res.send("OK");
});

// export đặt CUỐI CÙNG
export default app;


