import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
<<<<<<< HEAD

import userRoutes from "./routes/account.route";
import categoryRoutes from "./routes/category.route";
import cartRoutes from "./routes/cart.route";
import addressRoutes from "./routes/address.route";

import orderRoutes from "./routes/orders.route";
import paymentRoutes from "./routes/payment.route";
import paymentVNPayRoutes from "./routes/payment.vnpay.route";

=======
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
>>>>>>> feature/updateQuantity-v2
import dotenv from "dotenv";
dotenv.config();

const app = express();
<<<<<<< HEAD

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
app.use("/api/category", categoryRoutes);
app.use("/api/cart", cartRoutes);
=======
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
>>>>>>> feature/updateQuantity-v2
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

<<<<<<< HEAD
// 🔥 ADDRESS ROUTES (THÊM DÒNG NÀY)
app.use("/addresses", addressRoutes); // cho FE mới
app.use("/api/addresses", addressRoutes); // cho API cũ / thống nhất

app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/payment/vnpay", paymentVNPayRoutes);

=======
>>>>>>> feature/updateQuantity-v2
export default app;
