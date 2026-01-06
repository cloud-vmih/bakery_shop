"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOrderFullByIdDB = exports.updateOrderStatusDB = exports.createOrderDB = void 0;
const database_1 = require("../config/database");
const Orders_1 = require("../entity/Orders");
const OrderInfo_1 = require("../entity/OrderInfo");
const OrderDetails_1 = require("../entity/OrderDetails");
const enum_1 = require("../entity/enum/enum");
/* =========================
   CREATE ORDER (TRANSACTION)
========================= */
const createOrderDB = async (payload) => {
    return database_1.AppDataSource.transaction(async (manager) => {
        /* ---------- ORDER ---------- */
        const orderRepo = manager.getRepository(Orders_1.Order);
        const order = orderRepo.create({
            customer: { id: payload.customerId },
            status: enum_1.EOrderStatus.PENDING,
            createAt: new Date(),
        });
        const savedOrder = await orderRepo.save(order);
        /* ---------- ORDER INFO ---------- */
        const infoRepo = manager.getRepository(OrderInfo_1.OrderInfo);
        await infoRepo.save(infoRepo.create({
            order: savedOrder,
            cusName: payload.info.cusName,
            cusPhone: payload.info.cusPhone,
            cusGmail: payload.info.cusGmail,
            address: { id: payload.info.addressId },
            note: payload.info.note,
            branchId: payload.branchId,
        }));
        /* ---------- ORDER DETAILS ---------- */
        const detailRepo = manager.getRepository(OrderDetails_1.OrderDetail);
        await detailRepo.save(payload.items.map((i) => detailRepo.create({
            order: savedOrder,
            item: { id: i.itemId },
            quantity: i.quantity,
        })));
        return savedOrder;
    });
};
exports.createOrderDB = createOrderDB;
/* =========================
   UPDATE STATUS
========================= */
const updateOrderStatusDB = async (orderId, status) => {
    const repo = database_1.AppDataSource.getRepository(Orders_1.Order);
    const result = await repo.update({ id: orderId }, { status });
    if (!result.affected) {
        throw new Error("Order not found");
    }
    return repo.findOneBy({ id: orderId });
};
exports.updateOrderStatusDB = updateOrderStatusDB;
/* =========================
   FIND FULL ORDER (FOR SUCCESS / VNPAY)
========================= */
const findOrderFullByIdDB = async (orderId) => {
    return database_1.AppDataSource.getRepository(Orders_1.Order).findOne({
        where: { id: orderId },
        relations: {
            orderInfo: true,
            orderDetails: { item: true },
            customer: true,
        },
    });
};
exports.findOrderFullByIdDB = findOrderFullByIdDB;
