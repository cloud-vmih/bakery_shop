"use strict";
// server/src/db/repositories/order.repository.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRepo = void 0;
const database_1 = require("../config/database");
const Orders_1 = require("../entity/Orders");
const orderRepository = database_1.AppDataSource.getRepository(Orders_1.Order);
exports.orderRepo = {
    findByCustomerId: async (userId) => {
        return await orderRepository.find({
            where: { customer: { id: userId } },
            relations: ["orderDetails", "orderDetails.item"],
            // Tùy chọn: chỉ lấy các field cần của orderDetails
        });
    },
    findOneByIdAndCustomer: async (orderId, userId) => {
        console.log(orderId, userId);
        return await orderRepository.findOne({
            where: {
                id: orderId,
                customer: { id: userId },
            },
            relations: ["orderDetails", "customer", "payment", "orderDetails.item", "orderInfo"],
        });
    },
    save: async (order) => {
        return await orderRepository.save(order);
    }
};
