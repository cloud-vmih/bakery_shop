// server/src/controllers/order.controller.ts
import { Request, Response } from "express";
import { getMyOrders, getOrderStatus } from "../servies/order.service";
import { EOrderStatus } from "../entity/enum/enum";

export class OrderController {
  static async getMyOrders(req: Request, res: Response) {
    try {
      const user = (req as any).user; // từ auth middleware
      const user_orders = await getMyOrders(user.id);

      if (user_orders.orders.length === 0) {
        return res.json({ message: "Bạn chưa có đơn hàng nào.", orders: [] });
      }

      res.json({ user_orders });
    } catch (error) {
      res.status(500).json({ message: "Không thể tải danh sách đơn hàng. Vui lòng thử lại sau." });
    }
  }

  static async getOrderStatus(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const orderId = Number(req.params.orderId);

      const data = await getOrderStatus(orderId, user.id);

      if (!data) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng hoặc bạn không có quyền xem." });
      }

    //   // Trường hợp mới đặt, chưa xác nhận
    //   if (data.status === EOrderStatus.PENDING && data.timeline.length === 1) {
    //     data.message = "Đơn hàng đang chờ được xác nhận.";
    //   }

      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Không thể tải trạng thái đơn hàng. Vui lòng thử lại sau." });
    }
  }
}