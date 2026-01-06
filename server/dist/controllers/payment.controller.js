"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentByOrder = void 0;
const payment_service_1 = require("../services/payment.service");
const paymentService = new payment_service_1.PaymentService();
const getPaymentByOrder = async (req, res) => {
    try {
        const orderId = Number(req.params.orderId);
        const payment = await paymentService.getByOrder(orderId);
        return res.json(payment);
    }
    catch (e) {
        return res.status(404).json({ message: e.message });
    }
};
exports.getPaymentByOrder = getPaymentByOrder;
