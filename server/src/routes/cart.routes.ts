// server/src/routes/cart.routes.ts
import { Router } from "express";
import { addToCart, getCart } from "../controller/cart.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

// Yêu cầu đăng nhập để bảo đảm có userId cho logic giỏ hàng
router.post("/", verifyToken, addToCart);
router.get("/", verifyToken, getCart);

export default router;