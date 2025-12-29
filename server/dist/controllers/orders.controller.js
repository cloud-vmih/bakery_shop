"use strict";
// import { Request, Response } from "express";
// import { OrdersService } from "../services/orders.service";
// import { PaymentService } from "../services/payment.service";
// import { EPayment } from "../entity/enum/enum";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderById = exports.createOrder = void 0;
const orders_service_1 = require("../services/orders.service");
const payment_service_1 = require("../services/payment.service");
const inventory_service_1 = require("../services/inventory.service");
const enum_1 = require("../entity/enum/enum");
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
         } = req.body;
        console.log(`branch id : ${branchId}`);
        const inventoryItems = items.map((i) => ({
            itemId: i.item?.id, // 👈 LẤY ĐÚNG
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
