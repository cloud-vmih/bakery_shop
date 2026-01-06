import express from "express";
import {
  getOrders,
  getDetail,
  updateStatus,
  cancel,
  requestCancel,
  handleCancel,
  printInvoice,
} from "../controllers/manageOrder.controller";

import { verifyToken, verifyAdminOrStaff } from "../middleware/verifyToken";

// Chung
// router.use(verifyToken);
const router = express.Router();
// Staff + Admin
// router.use(roleMiddleware(["staff", "admin"]));
router.get("/", verifyToken, verifyAdminOrStaff, getOrders);
router.get("/:id", verifyToken, verifyAdminOrStaff, getDetail);
router.patch("/:id/status", verifyToken, verifyAdminOrStaff, updateStatus);
router.patch("/:id/cancel", verifyToken, verifyAdminOrStaff, cancel);           // Staff hủy trực tiếp
router.patch("/:id/handle-cancel", verifyToken, verifyAdminOrStaff, handleCancel); // Staff xử lý yêu cầu hủy
router.get("/:id/print", verifyToken, verifyAdminOrStaff, printInvoice);

// Khách hàng (không cần role staff/admin)
router.patch("/:id/request-cancel", verifyToken, requestCancel);

export default router