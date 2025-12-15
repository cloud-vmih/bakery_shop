// server/src/controllers/order.controller.ts
import { Request, Response } from "express";
import { getMyOrders, getOrderStatus, cancelOrder } from "../servies/order.service"; // sửa "servies" → "services"
import { EOrderStatus } from "../entity/enum/enum";

export class OrderController {
  static async getMyOrders(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id; // từ auth middleware

      const result = await getMyOrders(userId);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Lỗi lấy danh sách đơn hàng:", error);
      return res.status(500).json({
        message: "Không thể tải đơn hàng. Vui lòng thử lại sau.",
        orders: [],
      });
    }
  }

  static async getOrderStatus(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const orderId = Number(req.params.orderId);

      if (isNaN(orderId)) {
        return res.status(400).json({ message: "ID đơn hàng không hợp lệ" });
      }

      const data = await getOrderStatus(orderId, userId);

      if (!data) {
        return res.status(404).json({
          message: "Không tìm thấy đơn hàng hoặc bạn không có quyền truy cập.",
        });
      }

      return res.status(200).json(data);
    } catch (error: any) {
      console.error("Lỗi lấy trạng thái đơn hàng:", error);
      return res.status(500).json({
        message: "Không thể tải trạng thái đơn hàng. Vui lòng thử lại sau.",
      });
    }
  }

  static async cancelOrder(req: Request, res: Response) {
    try {
      const orderId = Number(req.params.orderId);
      const userId = (req as any).user.id;

      if (isNaN(orderId)) {
        return res.status(400).json({ message: "ID đơn hàng không hợp lệ" });
      }

      const result = await cancelOrder(orderId, userId);

      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      return res.status(200).json({ message: "Đơn hàng đã được hủy thành công" });
    } catch (error: any) {
      console.error("Lỗi hủy đơn hàng:", error);
      return res.status(500).json({ message: "Lỗi hệ thống khi hủy đơn hàng" });
    }
  }
}