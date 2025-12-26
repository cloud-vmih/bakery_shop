import { Router } from "express";
import { MembershipController } from "../controllers/mempoint.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

// Tích điểm (gọi từ order controller hoặc webhook sau thanh toán)
router.post("/accumulate", MembershipController.accumulatePoints);

// Lấy thông tin điểm của khách hàng
router.get("/membership/info", verifyToken, MembershipController.getPointsInfo);
// Hoặc nếu có auth: router.get("/my-points", authMiddleware, MembershipController.getPointsInfo);

export default router;