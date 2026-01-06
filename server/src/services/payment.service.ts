import {
  createPaymentDB,
  findPaymentByOrderIdDB,
  updatePaymentStatusDB,
} from "../db/payment.db";
import { EPayment, EPayStatus } from "../entity/enum/enum";

export class PaymentService {
  async createPayment(orderId: number, method: EPayment) {
    return createPaymentDB(orderId, method);
  }

  async markPaid(orderId: number) {
    const payment = await findPaymentByOrderIdDB(orderId);
    if (!payment) throw new Error("Payment not found");
    if (payment.status === EPayStatus.PAID) return payment;
    return updatePaymentStatusDB(orderId, EPayStatus.PAID);
  }

  async markFailed(orderId: number) {
    return updatePaymentStatusDB(orderId, EPayStatus.FAILED);
  }

  async getByOrder(orderId: number) {
    const payment = await findPaymentByOrderIdDB(orderId);
    if (!payment) throw new Error("Payment not found");
    return payment;
  }
}
