"use strict";
// import {
//   createOrderDB,
//   updateOrderStatusDB,
//   findOrderFullByIdDB,
// } from "../db/orders.db";
// import { EOrderStatus } from "../entity/enum/enum";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
// export class OrdersService {
//   /**
//    * CREATE ORDER
//    * - luôn tạo PENDING
//    */
//   async createOrder(userId: number, payload: any) {
//     return createOrderDB({
//       customerId: userId,
//       info: {
//         cusName: payload.customer.fullName,
//         cusPhone: payload.customer.phone,
//         cusGmail: payload.customer.email || "",
//         addressId: payload.address.addressId,
//         note: payload.note,
//       },
//       items: payload.items.map((i: any) => ({
//         itemId: i.item.id,
//         quantity: i.quantity,
//       })),
//     });
//   }
//   /**
//    * CONFIRM ORDER
//    * - COD hoặc VNPAY success
//    */
//   async confirmOrder(orderId: number) {
//     return updateOrderStatusDB(orderId, EOrderStatus.CONFIRMED);
//   }
//   /**
//    * CANCEL ORDER
//    * - VNPAY failed / canceled
//    */
//   async cancelOrder(orderId: number) {
//     return updateOrderStatusDB(orderId, EOrderStatus.CANCELED);
//   }
//   /**
//    * GET FULL ORDER
//    * - Success page
//    */
//   async getOrderFull(orderId: number) {
//     const order = await findOrderFullByIdDB(orderId);
//     if (!order) {
//       throw new Error("Order not found");
//     }
//     return order;
//   }
// }
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
            // ✅ TRUYỀN BRANCH ID XUỐNG DB
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
