<<<<<<< HEAD
import { Router } from "express";
import { createOrder, getOrderById } from "../controllers/orders.controller";
=======
// server/src/routes/order.routes.ts
import { Router } from "express";
import { OrderController } from "../controller/order.controller";
>>>>>>> feature/updateQuantity-v2
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

<<<<<<< HEAD
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
=======
router.get("/my-orders", verifyToken, OrderController.getMyOrders);
router.get("/:orderId/status", verifyToken, OrderController.getOrderStatus);
// routes/order.routes.ts
router.post("/:orderId/cancel", verifyToken, OrderController.cancelOrder);
export default router;
>>>>>>> feature/updateQuantity-v2
