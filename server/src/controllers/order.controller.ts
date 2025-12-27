// src/controllers/order.controller.ts
import { Request, Response } from "express";
import { EOrderStatus } from "../entity/enum/enum";
import {
  getOrderList,
  getOrderDetail,
  updateOrderStatus,
  requestCancelOrder,
  handleCancelRequest,
  generateInvoiceHTML,
  cancelOrder
} from "../services/manageOrder.service";
import * as customerOrderService from "../services/order.service";

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
    const staffId = req.user?.id;

    if (!staffId) {
      return res.status(401).json({ message: "Không có quyền" });
    }

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ message: "Hành động không hợp lệ" });
    }

    const order = await handleCancelRequest(orderId, action, String(staffId), note);

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

// XỬ LÝ ĐƠN HÀNG BÊN PHÍA CUSTOMER
export class OrderController {
  static async getMyOrders(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const result = await customerOrderService.getMyOrders(userId);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Lỗi lấy danh sách đơn hàng:", error);
      return res.status(500).json({ message: "Lỗi server", orders: [] });
    }
  }

  static async getOrderStatus(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const orderId = Number(req.params.orderId);

      if (isNaN(orderId)) {
        return res.status(400).json({ message: "ID đơn hàng không hợp lệ" });
      }

      const data = await customerOrderService.getOrderStatus(orderId, userId);
      console.log("Order status data:", data);
      if (!data) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }

      return res.status(200).json(data);
    } catch (error: any) {
      console.error("Lỗi lấy trạng thái đơn hàng:", error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  }

  static async cancelOrder(req: Request, res: Response) {
    try {
      const orderId = Number(req.params.orderId);
      const userId = (req as any).user.id;

      if (isNaN(orderId)) {
        return res.status(400).json({ message: "ID đơn hàng không hợp lệ" });
      }

      const result = await customerOrderService.cancelOrder(orderId, userId);

      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      return res.status(200).json({
        message: result.message,
        action: result.action, // để frontend hiển thị thông báo phù hợp
      });
    } catch (error: any) {
      console.error("Lỗi hủy đơn hàng:", error);
      return res.status(500).json({ message: "Lỗi hệ thống khi hủy đơn hàng" });
    }
  }
}