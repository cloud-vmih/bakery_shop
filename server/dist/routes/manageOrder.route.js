"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const manageOrder_controller_1 = require("../controllers/manageOrder.controller");
// Chung
// router.use(verifyToken);
const router = express_1.default.Router();
// Staff + Admin
// router.use(roleMiddleware(["staff", "admin"]));
router.get("/", manageOrder_controller_1.getOrders);
router.get("/:id", manageOrder_controller_1.getDetail);
router.patch("/:id/status", manageOrder_controller_1.updateStatus);
router.patch("/:id/cancel", manageOrder_controller_1.cancel); // Staff hủy trực tiếp
router.patch("/:id/handle-cancel", manageOrder_controller_1.handleCancel); // Staff xử lý yêu cầu hủy
router.get("/:id/print", manageOrder_controller_1.printInvoice);
// Khách hàng (không cần role staff/admin)
router.patch("/:id/request-cancel", manageOrder_controller_1.requestCancel);
exports.default = router;
