import { Router } from "express";
import { createOrder } from "../controllers/orders.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

// ===== ORDER =====
router.post("/", verifyToken, createOrder);

export default router;
