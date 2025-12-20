import { Response } from "express";
import { OrdersService } from "../services/orders.service";

const ordersService = new OrdersService();

/**
 * CREATE ORDER
 */
export const createOrder = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const result = await ordersService.createOrder(userId, req.body);
    return res.status(201).json(result);
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: error.message || "Không thể tạo đơn hàng" });
  }
};
