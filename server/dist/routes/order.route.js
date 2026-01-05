"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_1 = require("../middleware/verifyToken");
const order_controller_1 = require("../controllers/order.controller");
const router = express_1.default.Router();
router.get("/my-orders", verifyToken_1.verifyToken, order_controller_1.OrderController.getMyOrders);
router.get("/:orderId/status", verifyToken_1.verifyToken, order_controller_1.OrderController.getOrderStatus);
router.post("/:orderId/cancel", verifyToken_1.verifyToken, order_controller_1.OrderController.cancelOrder);
exports.default = router;
