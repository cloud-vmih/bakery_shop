"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoiceHTML = exports.updateOrderStatus = exports.getOrderDetail = exports.getOrderList = exports.handleCancelRequest = exports.requestCancelOrder = exports.cancelOrder = void 0;
const manageOrder_db_1 = require("../db/manageOrder.db");
const enum_1 = require("../entity/enum/enum");
const dayjs_1 = __importDefault(require("dayjs"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/* ================== STATUS FLOW ================== */
const allowedTransitions = {
    [enum_1.EOrderStatus.PENDING]: [enum_1.EOrderStatus.CONFIRMED],
    [enum_1.EOrderStatus.CONFIRMED]: [enum_1.EOrderStatus.PREPARING],
    [enum_1.EOrderStatus.PREPARING]: [enum_1.EOrderStatus.DELIVERING],
    [enum_1.EOrderStatus.DELIVERING]: [enum_1.EOrderStatus.COMPLETED],
    [enum_1.EOrderStatus.COMPLETED]: [],
    [enum_1.EOrderStatus.CANCELED]: [],
};
/* ================== ADMIN / STAFF CANCEL ================== */
// Admin / Staff hủy trực tiếp (mọi trạng thái trừ đang giao & hoàn thành)
const cancelOrder = async (orderId, cancelReason, handledBy = "ADMIN_OR_STAFF") => {
    const order = await (0, manageOrder_db_1.findOrderById)(orderId);
    if (!order)
        throw new Error("Đơn hàng không tồn tại");
    if ([enum_1.EOrderStatus.DELIVERING, enum_1.EOrderStatus.COMPLETED].includes(order.status)) {
        throw new Error("Không thể hủy khi đơn đang giao hoặc đã hoàn thành");
    }
    if (!cancelReason?.trim()) {
        throw new Error("Vui lòng nhập lý do hủy");
    }
    order.status = enum_1.EOrderStatus.CANCELED;
    order.cancelStatus = enum_1.ECancelStatus.APPROVED;
    order.cancelReason = cancelReason;
    order.cancelHandledBy = handledBy;
    // if (order.orderDetails?.[0]) {
    //   order.orderDetails[0].note = `Admin/Staff hủy: ${cancelReason}`;
    //   await saveOrderDetail(order.orderDetails[0]);
    // }
    return await (0, manageOrder_db_1.saveOrder)(order);
};
exports.cancelOrder = cancelOrder;
/* ================== CUSTOMER REQUEST CANCEL ================== */
// Khách hàng chỉ gửi yêu cầu hủy
const requestCancelOrder = async (orderId, userId, reason) => {
    const order = await (0, manageOrder_db_1.findOrderById)(orderId);
    if (!order)
        throw new Error("Đơn hàng không tồn tại");
    if (order.customer?.id !== userId) {
        throw new Error("Không phải đơn của bạn");
    }
    if ([enum_1.EOrderStatus.DELIVERING, enum_1.EOrderStatus.COMPLETED].includes(order.status)) {
        throw new Error("Không thể yêu cầu hủy ở trạng thái này");
    }
    if (order.cancelStatus !== enum_1.ECancelStatus.NONE) {
        throw new Error("Đã có yêu cầu hủy đang xử lý");
    }
    if (!reason?.trim()) {
        throw new Error("Vui lòng nhập lý do hủy");
    }
    order.cancelStatus = enum_1.ECancelStatus.REQUESTED;
    order.cancelReason = reason;
    if (order.orderInfo) {
        order.orderInfo.note = `Khách yêu cầu hủy: ${reason}`;
        await (0, manageOrder_db_1.saveOrderInfo)(order.orderInfo);
    }
    return await (0, manageOrder_db_1.saveOrder)(order);
};
exports.requestCancelOrder = requestCancelOrder;
/* ================== ADMIN / STAFF HANDLE REQUEST ================== */
const handleCancelRequest = async (orderId, action, staffId, note) => {
    const order = await (0, manageOrder_db_1.findOrderById)(orderId);
    if (!order)
        throw new Error("Đơn hàng không tồn tại");
    if (order.cancelStatus !== enum_1.ECancelStatus.REQUESTED) {
        throw new Error("Không có yêu cầu hủy nào đang chờ");
    }
    if (action === "approve") {
        if ([enum_1.EOrderStatus.DELIVERING, enum_1.EOrderStatus.COMPLETED].includes(order.status)) {
            throw new Error("Không thể duyệt hủy ở trạng thái này");
        }
        order.status = enum_1.EOrderStatus.CANCELED;
        order.cancelStatus = enum_1.ECancelStatus.APPROVED;
        order.cancelHandledBy = staffId;
        order.cancelNote = note;
        if (order.orderInfo) {
            order.orderInfo.note += ` | Đã duyệt hủy${note ? `: ${note}` : ""}`;
            await (0, manageOrder_db_1.saveOrderInfo)(order.orderInfo);
        }
    }
    else {
        order.cancelStatus = enum_1.ECancelStatus.REJECTED;
        order.cancelNote = note;
    }
    return await (0, manageOrder_db_1.saveOrder)(order);
};
exports.handleCancelRequest = handleCancelRequest;
/* ================== GET LIST ================== */
const getOrderList = async (filters) => {
    let query = manageOrder_db_1.orderRepo
        .createQueryBuilder("order")
        .leftJoinAndSelect("order.customer", "customer")
        .leftJoinAndSelect("order.orderDetails", "orderDetail")
        .orderBy("order.createAt", "DESC");
    if (filters.status) {
        query.andWhere("order.status = :status", { status: filters.status });
    }
    if (filters.customerName) {
        query.andWhere("LOWER(customer.fullName) LIKE LOWER(:name)", {
            name: `%${filters.customerName}%`,
        });
    }
    if (filters.fromDate) {
        query.andWhere("order.createAt >= :fromDate", {
            fromDate: (0, dayjs_1.default)(filters.fromDate, "DD/MM/YYYY").toDate(),
        });
    }
    if (filters.toDate) {
        query.andWhere("order.createAt <= :toDate", {
            toDate: (0, dayjs_1.default)(filters.toDate, "DD/MM/YYYY").toDate(),
        });
    }
    return await query.getMany();
};
exports.getOrderList = getOrderList;
/* ================== DETAIL ================== */
const getOrderDetail = async (orderId) => {
    const order = await (0, manageOrder_db_1.findOrderById)(orderId);
    if (!order)
        throw new Error("Đơn hàng không tồn tại");
    return order;
};
exports.getOrderDetail = getOrderDetail;
/* ================== UPDATE STATUS ================== */
const updateOrderStatus = async (orderId, newStatus) => {
    const order = await (0, manageOrder_db_1.findOrderById)(orderId);
    if (!order)
        throw new Error("Đơn hàng không tồn tại");
    if (order.status === enum_1.EOrderStatus.CANCELED) {
        throw new Error("Đơn đã hủy, không thể cập nhật trạng thái");
    }
    if (!allowedTransitions[order.status].includes(newStatus)) {
        throw new Error("Không thể chuyển sang trạng thái này");
    }
    order.status = newStatus;
    return await (0, manageOrder_db_1.saveOrder)(order);
};
exports.updateOrderStatus = updateOrderStatus;
/* ================== INVOICE ================== */
const generateInvoiceHTML = (order) => {
    const templatePath = path_1.default.join(__dirname, "../templates/invoice.html");
    let html = fs_1.default.readFileSync(templatePath, "utf-8");
    const itemInfo = order.orderDetails?.[0]?.item;
    const note = order.orderInfo?.note || "";
    const subtotal = (order.orderDetails?.[0]?.quantity || 1) * (itemInfo?.price || 0);
    return html
        .replace(/{{orderId}}/g, String(order.id))
        .replace(/{{customerName}}/g, order.customer?.fullName || "Khách lẻ")
        .replace(/{{phone}}/g, order.customer?.phoneNumber || "-")
        .replace(/{{date}}/g, new Date(order.createAt).toLocaleDateString("vi-VN"))
        .replace(/{{status}}/g, String(order.status ?? ""))
        .replace(/{{itemName}}/g, itemInfo?.name || "Sản phẩm")
        .replace(/{{quantity}}/g, String(order.orderDetails?.[0]?.quantity || 1))
        .replace(/{{price}}/g, String(itemInfo?.price || 0))
        .replace(/{{subtotal}}/g, subtotal.toLocaleString())
        .replace(/{{note}}/g, note);
};
exports.generateInvoiceHTML = generateInvoiceHTML;
