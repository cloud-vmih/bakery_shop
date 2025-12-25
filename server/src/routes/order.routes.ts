import express from "express";
import { verifyToken } from "../middleware/verifyToken";
import { OrderController } from "../controller/order.controller";

const router = express.Router();
router.get("/my-orders", verifyToken, OrderController.getMyOrders);
router.get("/:orderId/status", verifyToken, OrderController.getOrderStatus);
router.post("/:orderId/cancel", verifyToken, OrderController.cancelOrder);

export default router