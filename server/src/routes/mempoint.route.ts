import { Router } from "express";
import { MembershipController } from "../controllers/mempoint.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

// Tích điểm – orderId từ params, orderAmount từ body
router.post("/accumulate/:orderId", verifyToken, MembershipController.accumulatePoints);

// Lấy thông tin điểm của user hiện tại (từ token)
router.get("/membership/info", verifyToken, MembershipController.getPointsInfo);
// Hoặc nếu có auth: router.get("/my-points", authMiddleware, MembershipController.getPointsInfo);

export default router;