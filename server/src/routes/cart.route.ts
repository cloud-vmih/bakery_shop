<<<<<<< HEAD
import { Router } from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller";
=======
// server/src/routes/cart.routes.ts
import { Router } from "express";
import { addToCart, getCart } from "../controller/cart.controller";
>>>>>>> feature/updateQuantity-v2
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

<<<<<<< HEAD
// ===== CART =====
router.post("/", verifyToken, addToCart);
router.get("/", verifyToken, getCart);
router.delete("/", verifyToken, clearCart);

// ===== CART ITEM =====
router.put("/item/:id", verifyToken, updateCartItem); // + / -
router.delete("/item/:id", verifyToken, removeCartItem); // xoá item

export default router;
=======
// Yêu cầu đăng nhập để bảo đảm có userId cho logic giỏ hàng
router.post("/cart", verifyToken, addToCart);
router.get("/cart", verifyToken, getCart);

export default router;
>>>>>>> feature/updateQuantity-v2
