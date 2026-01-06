"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderById = exports.createOrder = void 0;
const orders_service_1 = require("../services/orders.service");
const payment_service_1 = require("../services/payment.service");
const inventory_service_1 = require("../services/inventory.service");
const enum_1 = require("../entity/enum/enum");
const mempoint_service_1 = require("../services/mempoint.service");
const user_service_1 = require("../services/user.service");
const notification_service_1 = require("../services/notification.service");
const ordersService = new orders_service_1.OrdersService();
const paymentService = new payment_service_1.PaymentService();
/**
 * CREATE ORDER
 * - Luôn giữ hàng trước
 * - COD: giữ → tạo order → tạo payment → trừ kho → confirm
 * - VNPAY: giữ → tạo order → tạo payment → chờ callback
 */
const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { paymentMethod, branchId, items, // [{ itemId, quantity }]
        totalAmount, } = req.body;
        const inventoryItems = items.map((i) => ({
            itemId: i.item?.id,
            quantity: i.quantity,
        }));
        /* =========================
           1️⃣ GIỮ HÀNG
        ========================= */
        await (0, inventory_service_1.reserveInventoryForOrder)(branchId, inventoryItems);
        /* =========================
           2️⃣ TẠO ORDER (PENDING)
        ========================= */
        const order = await ordersService.createOrder(userId, req.body);
        /* =========================
           3️⃣ COD FLOW
        ========================= */
        if (paymentMethod === enum_1.EPayment.COD) {
            // tạo payment COD
            await paymentService.createPayment(order.id, enum_1.EPayment.COD);
            // trừ kho thật
            await (0, inventory_service_1.commitInventoryForOrder)(branchId, inventoryItems);
            // confirm order
            await ordersService.confirmOrder(order.id);
            await mempoint_service_1.MembershipService.accumulatePoints(userId, // customerId
            order.id, // orderId
            totalAmount // orderAmount
            );
            await (0, notification_service_1.sendNotification)([userId], "Đặt hàng thành công", `Đơn hàng #${order.id} của bạn đã được xác nhận`, enum_1.ENotiType.ORDER, `/orderDetails/${order.id}`);
            const adminStaffIds = await (0, user_service_1.getAdminAndStaffIds)();
            await (0, notification_service_1.sendNotification)(adminStaffIds, "Đơn hàng mới", `Có đơn hàng mới #${order.id} cần xử lý`, enum_1.ENotiType.ORDER, `/admin/manage-orders`);
            return res.status(201).json({
                success: true,
                orderId: order.id,
                orderStatus: "CONFIRMED",
                paymentMethod: "COD",
            });
        }
        /* =========================
           4️⃣ VNPAY FLOW
           - chỉ giữ hàng
           - chờ callback xử lý tiếp
        ========================= */
        await paymentService.createPayment(order.id, enum_1.EPayment.VNPAY);
        //
        return res.status(201).json({
            success: true,
            orderId: order.id,
            orderStatus: "PENDING",
            paymentMethod: "VNPAY",
        });
    }
    catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message,
        });
    }
};
exports.createOrder = createOrder;
/**
 * GET ORDER DETAIL
 */
const getOrderById = async (req, res) => {
    try {
        const orderId = Number(req.params.orderId);
        const order = await ordersService.getOrderFull(orderId);
        return res.status(200).json({
            success: true,
            data: order,
        });
    }
    catch (e) {
        return res.status(404).json({
            success: false,
            message: e.message,
        });
    }
};
exports.getOrderById = getOrderById;
