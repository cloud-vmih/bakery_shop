import { findPaymentByOrderIdDB } from "../db/payment.db";

export class PaymentService {
  async getPaymentByOrder(orderId: number) {
    const payment = await findPaymentByOrderIdDB(orderId);
    if (!payment) throw new Error("Không tìm thấy payment");
    return payment;
  }
}
