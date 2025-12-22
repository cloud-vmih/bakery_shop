import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";

const paymentService = new PaymentService();

export const getPaymentByOrder = async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.params.orderId);
    const payment = await paymentService.getByOrder(orderId);
    return res.json(payment);
  } catch (e: any) {
    return res.status(404).json({ message: e.message });
  }
};
