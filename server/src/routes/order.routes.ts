import express from "express";
import { verifyToken } from "../middleware/verifyToken";
import { roleMiddleware } from "../middleware/roleMiddleware";
import {
  getOrders,
  getDetail,
  updateStatus,
  cancel,
  requestCancel,
  handleCancel,
  printInvoice,
} from "../controller/order.controller";

const router = express.Router();


router.patch("/:id/request-cancel", requestCancel);


// Chung
// router.use(verifyToken);

// Staff + Admin
// router.use(roleMiddleware(["staff", "admin"]));
router.get("/", getOrders);
router.get("/:id", getDetail);
router.patch("/:id/status", updateStatus);
router.patch("/:id/cancel", cancel);           // Staff hủy trực tiếp
router.patch("/:id/handle-cancel", handleCancel); // Staff xử lý yêu cầu hủy
router.get("/:id/print", printInvoice);

// Khách hàng (không cần role staff/admin)
router.patch("/:id/request-cancel", requestCancel);

export default router;