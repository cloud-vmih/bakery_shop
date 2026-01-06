"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/dashboard.routes.ts
const express_1 = __importDefault(require("express"));
<<<<<<< HEAD
=======
const verifyToken_1 = require("../middleware/verifyToken");
>>>>>>> origin/feature/cake-filling
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const router = express_1.default.Router();
// router.use(verifyToken);
// router.use(roleMiddleware(["admin"])); - dùng hàm trong verifyToken luôn 
<<<<<<< HEAD
router.get("/", dashboard_controller_1.getDashboard);
=======
router.get("/", verifyToken_1.verifyToken, verifyToken_1.verifyAdminOrStaff, dashboard_controller_1.getDashboard);
>>>>>>> origin/feature/cake-filling
exports.default = router;
