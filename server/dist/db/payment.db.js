"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentStatusDB = exports.findPaymentByOrderIdDB = exports.createPaymentDB = void 0;
const database_1 = require("../config/database");
const Payment_1 = require("../entity/Payment");
const enum_1 = require("../entity/enum/enum");
const createPaymentDB = async (orderId, method) => {
    const repo = database_1.AppDataSource.getRepository(Payment_1.Payment);
    return repo.save(repo.create({
        order: { id: orderId },
        paymentMethod: method,
        status: enum_1.EPayStatus.PENDING,
        createAt: new Date(),
    }));
};
exports.createPaymentDB = createPaymentDB;
const findPaymentByOrderIdDB = async (orderId) => {
    return database_1.AppDataSource.getRepository(Payment_1.Payment).findOne({
        where: { order: { id: orderId } },
        relations: ["order"],
    });
};
exports.findPaymentByOrderIdDB = findPaymentByOrderIdDB;
const updatePaymentStatusDB = async (orderId, status) => {
    const repo = database_1.AppDataSource.getRepository(Payment_1.Payment);
    const payment = await (0, exports.findPaymentByOrderIdDB)(orderId);
    if (!payment)
        throw new Error("Payment not found");
    payment.status = status;
    return repo.save(payment);
};
exports.updatePaymentStatusDB = updatePaymentStatusDB;
