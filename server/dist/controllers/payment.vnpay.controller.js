"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vnpayReturn = exports.createVNPayPayment = void 0;
const crypto_1 = __importDefault(require("crypto"));
const vnpay_helper_1 = require("../helpers/vnpay.helper");
const payment_service_1 = require("../services/payment.service");
const orders_service_1 = require("../services/orders.service");
const inventory_service_1 = require("../services/inventory.service");
const mempoint_service_1 = require("../services/mempoint.service");
const enum_1 = require("../entity/enum/enum");
const notification_service_1 = require("../services/notification.service");
const user_service_1 = require("../services/user.service");
const paymentService = new payment_service_1.PaymentService();
const ordersService = new orders_service_1.OrdersService();
/* =====================================================
   CREATE VNPAY PAYMENT URL
   POST /api/payment/vnpay/create
===================================================== */
const createVNPayPayment = async (req, res) => {
    try {
        const { orderId, amount } = req.body;
        const userId = Number(req.user.id);
        if (!orderId || !amount || !userId) {
            return res.status(400).json({
                success: false,
                message: "Thiếu orderId hoặc amount hoặc userId",
            });
        }
        const ipAddr = req.headers["x-forwarded-for"] ||
            req.socket.remoteAddress ||
            "127.0.0.1";
        const vnpayUrl = (0, vnpay_helper_1.createVNPayUrl)({
            orderId,
            amount,
            returnUrl: process.env.VNPAY_RETURN_URL,
            ipAddr,
            userId,
        });
        return res.status(200).json({
            success: true,
            vnpayUrl,
        });
    }
    catch (error) {
        console.error("❌ CREATE VNPAY URL ERROR", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Không tạo được VNPay URL",
        });
    }
};
exports.createVNPayPayment = createVNPayPayment;
/* =====================================================
   VNPAY RETURN CALLBACK
   GET /api/payment/vnpay/return
===================================================== */
const vnpayReturn = async (req, res) => {
    const { amount } = req.body;
    try {
        /* =========================
           1️⃣ VERIFY SIGNATURE
        ========================= */
        const vnp_Params = { ...req.query };
        const secureHash = vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHashType"];
        const encodeVNPay = (value) => encodeURIComponent(value).replace(/%20/g, "+");
        const sortedKeys = Object.keys(vnp_Params).sort();
        let hashData = "";
        let first = true;
        for (const key of sortedKeys) {
            const value = vnp_Params[key];
            if (value !== undefined && value !== null && value !== "") {
                if (!first)
                    hashData += "&";
                first = false;
                hashData += `${key}=${encodeVNPay(value)}`;
            }
        }
        const signed = crypto_1.default
            .createHmac("sha512", process.env.VNPAY_HASH_SECRET)
            .update(hashData, "utf-8")
            .digest("hex");
        if (secureHash !== signed) {
            console.error("❌ INVALID VNPAY SIGNATURE");
            return res.redirect(`${process.env.CLIENT_URL}/payment/vnpay/return?reason=invalid_hash`);
        }
        /* =========================
           2️⃣ EXTRACT DATA
        ========================= */
        const txnRef = vnp_Params["vnp_TxnRef"];
        const responseCode = vnp_Params["vnp_ResponseCode"];
        const amount = Number(vnp_Params["vnp_Amount"]) / 100; // VNPay trả về *100
        // vnp_TxnRef = orderId[_userId][_timestamp]
        const orderId = Number(txnRef.split("_")[0]);
        const userId = Number(txnRef.split("_")[1]);
        /* =========================
           3️⃣ LOAD ORDER + INVENTORY DATA
        ========================= */
        const order = await ordersService.getOrderFull(orderId);
        if (!order || !order.orderInfo) {
            throw new Error("Order or OrderInfo not found");
        }
        const branchId = order.orderInfo.branchId;
        if (!order.orderDetails || order.orderDetails.length === 0) {
            throw new Error("Order has no order details");
        }
        const inventoryItems = order.orderDetails.map((od) => ({
            itemId: od.item.id,
            quantity: od.quantity,
        }));
        /* =========================
           4️⃣ PAYMENT SUCCESS
        ========================= */
        if (responseCode === "00") {
            // 1️⃣ update payment
            await paymentService.markPaid(orderId);
            // 2️⃣ trừ kho thật
            await (0, inventory_service_1.commitInventoryForOrder)(branchId, inventoryItems);
            // 3️⃣ confirm order
            await ordersService.confirmOrder(orderId);
            await (0, notification_service_1.sendNotification)([userId], "Đặt hàng thành công", `Đơn hàng #${order.id} của bạn đã được xác nhận`, enum_1.ENotiType.ORDER, `/orderDetails/${order.id}`);
            const adminStaffIds = await (0, user_service_1.getAdminAndStaffIds)();
            await (0, notification_service_1.sendNotification)(adminStaffIds, "Đơn hàng mới", `Có đơn hàng mới #${order.id} cần xử lý`, enum_1.ENotiType.ORDER, `/admin/manage-orders`);
            await mempoint_service_1.MembershipService.accumulatePoints(userId, orderId, amount);
            return res.redirect(`${process.env.CLIENT_URL}/payment/vnpay/return?` +
                `vnp_ResponseCode=00&orderId=${orderId}`);
        }
        /* =========================
           5️⃣ PAYMENT FAILED / CANCELED
        ========================= */
        await paymentService.markFailed(orderId);
        // trả hàng đã giữ
        await (0, inventory_service_1.rollbackInventoryForOrder)(branchId, inventoryItems);
        // hủy order
        await ordersService.cancelOrder(orderId);
        return res.redirect(`${process.env.CLIENT_URL}/payment/vnpay/return?` +
            `vnp_ResponseCode=${responseCode}&orderId=${orderId}`);
    }
    catch (error) {
        console.error("❌ VNPAY CALLBACK ERROR", error);
        return res.redirect(`${process.env.CLIENT_URL}/payment/vnpay/return?reason=exception`);
    }
};
exports.vnpayReturn = vnpayReturn;
