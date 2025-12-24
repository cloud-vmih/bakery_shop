// src/routes/dashboard.routes.ts
import express from "express";
import { verifyToken } from "../middleware/verifyToken";
import { roleMiddleware } from "../middleware/roleMiddleware";
import { getDashboard } from "../controller/dashboard.controller"; // ← "controller" (không "s")

const router = express.Router();

// router.use(verifyToken);
// router.use(roleMiddleware(["admin"]));

router.get("/", getDashboard);

export default router;