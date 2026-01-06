// src/controllers/order.controller.ts
import { Request, Response } from "express";
import { EOrderStatus } from "../entity/enum/enum";
import {
  getOrderList,
  getOrderDetail,
  updateOrderStatus,
  cancelOrder,
  requestCancelOrder,
  handleCancelRequest,
  generateInvoiceHTML,
} from "../services/manageOrder.service";

/* ================== TYPE ================== */
interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

/* ================== GET ================== */
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await getOrderList(req.query);
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

export const getDetail = async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.params.id);
    if (isNaN(orderId)) {
      return res.status(400).json({ message: "ID đơn hàng không hợp lệ" });
    }

    const order = await getOrderDetail(orderId);
    res.json(order);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

/* ================== UPDATE STATUS ================== */
export const updateStatus = async (req: AuthRequest, res: Response) => {
  try {
    const orderId = Number(req.params.id);
    const { newStatus } = req.body;

    if (!Object.values(EOrderStatus).includes(newStatus)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    const order = await updateOrderStatus(orderId, newStatus);
    res.json({ message: "Cập nhật trạng thái thành công", order });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/* ================== STAFF CANCEL (TRỰC TIẾP) ================== */
export const cancel = async (req: AuthRequest, res: Response) => {
  try {
    const orderId = Number(req.params.id);
    const { cancelReason } = req.body;

    if (!cancelReason?.trim()) {
      return res.status(400).json({ message: "Vui lòng nhập lý do hủy" });
    }

    const order = await cancelOrder(orderId, cancelReason.trim());
    res.json({ message: "Hủy đơn thành công", order });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/* ================== CUSTOMER REQUEST CANCEL ================== */
export const requestCancel = async (req: AuthRequest, res: Response) => {
  try {
    const orderId = Number(req.params.id);
    const userId = req.user?.id;
    const { reason } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    if (!reason?.trim()) {
      return res.status(400).json({ message: "Vui lòng nhập lý do hủy" });
    }

    const order = await requestCancelOrder(orderId, userId, reason.trim());
    res.json({ message: "Đã gửi yêu cầu hủy đơn", order });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/* ================== STAFF HANDLE CANCEL ================== */
export const handleCancel = async (req: AuthRequest, res: Response) => {
  try {
    const orderId = Number(req.params.id);
    const { action, note } = req.body;

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ message: "Hành động không hợp lệ" });
    }

    // Không bắt buộc phải có user ID (vì quyền đã kiểm tra ở frontend)
    // Nếu có thì dùng, không có thì để "Nhân viên" chung chung
   const handledById = req.user?.id ? String(req.user.id) : undefined;

    const order = await handleCancelRequest(orderId, action, handledById, note);

    res.json({
      message: action === "approve"
        ? "Đã duyệt hủy đơn"
        : "Đã từ chối yêu cầu hủy",
      order,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/* ================== PRINT INVOICE ================== */
export const printInvoice = async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.params.id);
    const order = await getOrderDetail(orderId);
    const html = generateInvoiceHTML(order);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};