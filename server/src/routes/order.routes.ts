// server/src/routes/order.routes.ts
import { Router } from "express";
import { OrderController } from "../controller/order.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.get("/my-orders", verifyToken, OrderController.getMyOrders);
router.get("/:orderId/status", verifyToken, OrderController.getOrderStatus);

export default router;