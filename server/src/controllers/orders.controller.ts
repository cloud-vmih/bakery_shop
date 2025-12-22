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
