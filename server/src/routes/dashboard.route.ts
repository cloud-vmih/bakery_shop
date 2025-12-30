// src/routes/dashboard.routes.ts
import express from "express";
import { verifyToken, verifyAdminOrStaff } from "../middleware/verifyToken";
import { getDashboard } from "../controllers/dashboard.controller"; 

const router = express.Router();

// router.use(verifyToken);
// router.use(roleMiddleware(["admin"])); - dùng hàm trong verifyToken luôn 

router.get("/", verifyToken, verifyAdminOrStaff, getDashboard);

export default router;