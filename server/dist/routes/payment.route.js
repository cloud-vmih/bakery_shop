"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const verifyToken_1 = require("../middleware/verifyToken");
const router = (0, express_1.Router)();
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
router.get("/order/:orderId", verifyToken_1.verifyToken, payment_controller_1.getPaymentByOrder);
exports.default = router;
