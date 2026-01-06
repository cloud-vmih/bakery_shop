"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const payment_db_1 = require("../db/payment.db");
const enum_1 = require("../entity/enum/enum");
class PaymentService {
    async createPayment(orderId, method) {
        return (0, payment_db_1.createPaymentDB)(orderId, method);
    }
    async markPaid(orderId) {
        const payment = await (0, payment_db_1.findPaymentByOrderIdDB)(orderId);
        if (!payment)
            throw new Error("Payment not found");
        if (payment.status === enum_1.EPayStatus.PAID)
            return payment;
        return (0, payment_db_1.updatePaymentStatusDB)(orderId, enum_1.EPayStatus.PAID);
    }
    async markFailed(orderId) {
        return (0, payment_db_1.updatePaymentStatusDB)(orderId, enum_1.EPayStatus.FAILED);
    }
    async getByOrder(orderId) {
        const payment = await (0, payment_db_1.findPaymentByOrderIdDB)(orderId);
        if (!payment)
            throw new Error("Payment not found");
        return payment;
    }
}
exports.PaymentService = PaymentService;
