"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveOrderInfo = exports.saveOrder = exports.findOrderById = exports.findOrdersWithFilter = exports.orderInfoRepo = exports.orderDetailRepo = exports.orderRepo = void 0;
const database_1 = require("../config/database");
const Orders_1 = require("../entity/Orders");
const OrderDetails_1 = require("../entity/OrderDetails");
const OrderInfo_1 = require("../entity/OrderInfo");
exports.orderRepo = database_1.AppDataSource.getRepository(Orders_1.Order);
exports.orderDetailRepo = database_1.AppDataSource.getRepository(OrderDetails_1.OrderDetail);
exports.orderInfoRepo = database_1.AppDataSource.getRepository(OrderInfo_1.OrderInfo);
const findOrdersWithFilter = async (queryBuilder) => {
    return await queryBuilder.getMany();
};
exports.findOrdersWithFilter = findOrdersWithFilter;
/* ================== CHI TIẾT ĐƠN HÀNG - DÙNG CHO IN HÓA ĐƠN ================== */
const findOrderById = async (orderId) => {
    return await exports.orderRepo.findOne({
        where: { id: orderId },
        relations: [
            "customer",
            "orderDetails", // Join orderDetails
            "orderDetails.item", // ← QUAN TRỌNG: Join sâu đến Item để lấy name, price
            "payment", // Nếu có payment (phương thức, trạng thái thanh toán)
            "orderInfo", // Để lấy note (lịch sử hủy, ghi chú)
        ],
    });
};
exports.findOrderById = findOrderById;
const saveOrder = async (order) => {
    return await exports.orderRepo.save(order);
};
exports.saveOrder = saveOrder;
const saveOrderInfo = async (info) => {
    return await exports.orderInfoRepo.save(info);
};
exports.saveOrderInfo = saveOrderInfo;
