import { Router } from "express";
import { getPaymentByOrder } from "../controllers/payment.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

// ===== PAYMENT =====
router.get("/order/:orderId", verifyToken, getPaymentByOrder);

export default router;
