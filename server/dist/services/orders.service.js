"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const orders_db_1 = require("../db/orders.db");
const enum_1 = require("../entity/enum/enum");
class OrdersService {
    /**
     * CREATE ORDER
     * - luôn tạo PENDING
     * - lưu branchId vào OrderInfo
     */
    async createOrder(userId, payload) {
        return (0, orders_db_1.createOrderDB)({
            customerId: userId,
            branchId: payload.branchId,
            info: {
                cusName: payload.customer.fullName,
                cusPhone: payload.customer.phone,
                cusGmail: payload.customer.email || "",
                addressId: payload.address.addressId,
                note: payload.note,
            },
            items: payload.items.map((i) => ({
                itemId: i.item.id,
                quantity: i.quantity,
                note: i.note || null,
            })),
        });
    }
    /**
     * CONFIRM ORDER
     * - COD hoặc VNPAY success
     */
    async confirmOrder(orderId) {
        return (0, orders_db_1.updateOrderStatusDB)(orderId, enum_1.EOrderStatus.CONFIRMED);
    }
    /**
     * CANCEL ORDER
     * - VNPAY failed / canceled
     */
    async cancelOrder(orderId) {
        return (0, orders_db_1.updateOrderStatusDB)(orderId, enum_1.EOrderStatus.CANCELED);
    }
    /**
     * GET FULL ORDER
     * - Success page
     * - VNPay callback
     */
    async getOrderFull(orderId) {
        const order = await (0, orders_db_1.findOrderFullByIdDB)(orderId);
        if (!order) {
            throw new Error("Order not found");
        }
        return order;
    }
}
exports.OrdersService = OrdersService;
