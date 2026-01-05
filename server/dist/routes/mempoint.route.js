"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mempoint_controller_1 = require("../controllers/mempoint.controller");
const verifyToken_1 = require("../middleware/verifyToken");
const router = (0, express_1.Router)();
// // Tích điểm – orderId từ params, orderAmount từ body
// router.post("/accumulate/:orderId", verifyToken, MembershipController.accumulatePoints);
// Lấy thông tin điểm của user hiện tại (từ token)
router.get("/membership/info", verifyToken_1.verifyToken, mempoint_controller_1.MembershipController.getPointsInfo);
// Hoặc nếu có auth: router.get("/my-points", authMiddleware, MembershipController.getPointsInfo);
exports.default = router;
