"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/dashboard.routes.ts
const express_1 = __importDefault(require("express"));
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const router = express_1.default.Router();
// router.use(verifyToken);
// router.use(roleMiddleware(["admin"])); - dùng hàm trong verifyToken luôn 
router.get("/", dashboard_controller_1.getDashboard);
exports.default = router;
