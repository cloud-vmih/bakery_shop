// src/routes/dashboard.routes.ts
import express from "express";
import { verifyToken } from "../middleware/verifyToken";
import { getDashboard } from "../controllers/dashboard.controller"; 

const router = express.Router();

// router.use(verifyToken);
// router.use(roleMiddleware(["admin"])); - dùng hàm trong verifyToken luôn 

router.get("/", getDashboard);

export default router;