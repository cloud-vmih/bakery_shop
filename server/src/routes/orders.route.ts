import { Router } from "express";
import { createOrder, getOrderById } from "../controllers/orders.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

/**
 * =========================
 * ORDER
 * =========================
 * POST   /api/orders        → tạo order (COD | VNPAY)
 * GET    /api/orders/:id    → lấy order (success page)
 */
router.post("/", verifyToken, createOrder);
router.get("/:orderId", verifyToken, getOrderById);

export default router;
