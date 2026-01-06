"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_vnpay_controller_1 = require("../controllers/payment.vnpay.controller");
const verifyToken_1 = require("../middleware/verifyToken");
const router = (0, express_1.Router)();
/**
 * ============================
 * CREATE VNPAY URL
 * FE gọi khi user chọn thanh toán VNPAY
 * ============================
 */
router.post("/create", verifyToken_1.verifyToken, payment_vnpay_controller_1.createVNPayPayment);
/**
 * ============================
 * VNPAY RETURN CALLBACK
 * ⚠️ KHÔNG verifyToken
 * VNPay redirect user về
 * ============================
 */
router.get("/return", payment_vnpay_controller_1.vnpayReturn);
exports.default = router;
