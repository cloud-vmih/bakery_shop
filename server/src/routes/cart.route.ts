import { Router } from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

// ===== CART =====
router.post("/", verifyToken, addToCart);
router.get("/", verifyToken, getCart);
router.delete("/", verifyToken, clearCart);

// ===== CART ITEM =====
router.put("/item/:id", verifyToken, updateCartItem); // + / -
router.delete("/item/:id", verifyToken, removeCartItem); // xoá item

export default router;
