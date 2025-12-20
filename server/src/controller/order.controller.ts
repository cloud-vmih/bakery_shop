// server/src/controllers/order.controller.ts
import { Request, Response } from "express";
import { getMyOrders, getOrderStatus, cancelOrder } from "../servies/order.service";

export class OrderController {
  static async getMyOrders(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const result = await getMyOrders(userId);
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

      const data = await getOrderStatus(orderId, userId);
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

      const result = await cancelOrder(orderId, userId);

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