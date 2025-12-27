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
import orderRoutes from "./routes/orders.route";
import wishlistRoutes from "./routes/wishlist.route";
import itemsDiscountRoutes from "./routes/itemsDiscount.route";
import staffRoutes from "./routes/staff.route";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // chỉ định frontend origin
    credentials: true, // cho phép gửi cookie / auth headers
  })
);
app.use(express.json());
app.use("/api", categoryRoutes);
app.use("/api", cartRoutes); // Thêm dòng này
app.use("/api", userRoutes);
app.use("/api/branchs", branchRoutes);
app.use("/api/items", itemRoutes);
app.use("/api", inventoryRoutes);
app.use("/api", addressRoutes);
app.use("/api", profileRoutes);
app.use("/api", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/items-discount", itemsDiscountRoutes);
app.use("/api/staff", staffRoutes);

export default app;
