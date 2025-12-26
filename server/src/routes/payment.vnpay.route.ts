import { Router } from "express";
import {
  createVNPayPayment,
  vnpayReturn,
} from "../controllers/payment.vnpay.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

/**
 * ============================
 * CREATE VNPAY URL
 * FE gọi khi user chọn thanh toán VNPAY
 * ============================
 */
router.post("/create", verifyToken, createVNPayPayment);

/**
 * ============================
 * VNPAY RETURN CALLBACK
 * ⚠️ KHÔNG verifyToken
 * VNPay redirect user về
 * ============================
 */
router.get("/return", vnpayReturn);

export default router;
