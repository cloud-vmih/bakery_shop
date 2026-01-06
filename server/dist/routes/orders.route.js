"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orders_controller_1 = require("../controllers/orders.controller");
const verifyToken_1 = require("../middleware/verifyToken");
const router = (0, express_1.Router)();
/**
 * =========================
 * ORDER
 * =========================
 * POST   /api/orders        → tạo order (COD | VNPAY)
 * GET    /api/orders/:id    → lấy order (success page)
 */
router.post("/", verifyToken_1.verifyToken, orders_controller_1.createOrder);
router.get("/:orderId", verifyToken_1.verifyToken, orders_controller_1.getOrderById);
exports.default = router;
