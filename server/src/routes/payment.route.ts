import { Router } from "express";
import { getPaymentByOrder } from "../controllers/payment.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

/**
 * =========================
 * PAYMENT
 * =========================
 * GET /api/payment/order/:orderId
 * - FE dùng để check:
 *   + payment.status
 *   + order.status
 * - DÙNG cho VNPayReturnPage
 */
router.get("/order/:orderId", verifyToken, getPaymentByOrder);

export default router;
