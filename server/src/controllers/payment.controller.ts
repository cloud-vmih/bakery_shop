import { Response } from "express";
import { PaymentService } from "../services/payment.service";

const paymentService = new PaymentService();

/**
 * GET PAYMENT BY ORDER
 */
export const getPaymentByOrder = async (req: any, res: Response) => {
  try {
    const orderId = Number(req.params.orderId);
    const payment = await paymentService.getPaymentByOrder(orderId);
    return res.json(payment);
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: error.message || "Không lấy được payment" });
  }
};
