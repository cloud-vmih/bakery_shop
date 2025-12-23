<<<<<<< HEAD
import { Request, Response } from "express";
import { OrdersService } from "../services/orders.service";
import { PaymentService } from "../services/payment.service";
import { EPayment } from "../entity/enum/enum";

const ordersService = new OrdersService();
const paymentService = new PaymentService();

export const createOrder = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { paymentMethod } = req.body;

    const order = await ordersService.createOrder(userId, req.body);

    // COD
    if (paymentMethod === EPayment.COD) {
      await paymentService.createPayment(order.id!, EPayment.COD);
      await ordersService.confirmOrder(order.id!);

      return res.status(201).json({
        orderId: order.id,
        orderStatus: "CONFIRMED",
        paymentMethod: "COD",
      });
    }

    // VNPAY
    await paymentService.createPayment(order.id!, EPayment.VNPAY);

    return res.status(201).json({
      orderId: order.id,
      orderStatus: "PENDING",
      paymentMethod: "VNPAY",
    });
  } catch (e: any) {
    return res.status(400).json({ message: e.message });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.params.orderId);
    const order = await ordersService.getOrderFull(orderId);
    return res.json(order);
  } catch (e: any) {
    return res.status(404).json({ message: e.message });
  }
};
=======
// server/src/controllers/order.controller.ts
import { Request, Response } from "express";
import { getMyOrders, getOrderStatus, cancelOrder } from "../services/order.service";

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
>>>>>>> feature/updateQuantity-v2
