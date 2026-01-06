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
const cancelOrder = async (orderId, cancelNote, handledBy = "ADMIN_OR_STAFF") => {
    const order = await (0, manageOrder_db_1.findOrderById)(orderId);
    if (!order)
        throw new Error("Đơn hàng không tồn tại");
    if ([enum_1.EOrderStatus.DELIVERING, enum_1.EOrderStatus.COMPLETED].includes(order.status)) {
        throw new Error("Không thể hủy khi đơn đang giao hoặc đã hoàn thành");
    }
    if (!cancelNote?.trim()) {
        throw new Error("Vui lòng nhập lý do hủy");
    }
    order.status = enum_1.EOrderStatus.CANCELED;
    order.cancelStatus = enum_1.ECancelStatus.APPROVED;
    order.cancelNote = cancelNote.trim();
    order.cancelHandledBy = handledBy;
    // Ghi lịch sử vào orderInfo.note (nếu cần)
    if (order.orderInfo) {
        const historyNote = `Admin hủy đơn: ${cancelNote.trim()}`;
        if (order.orderInfo.note) {
            order.orderInfo.note += ` | ${historyNote}`;
        }
        else {
            order.orderInfo.note = historyNote;
        }
        await (0, manageOrder_db_1.saveOrderInfo)(order.orderInfo);
    }
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
const handleCancelRequest = async (orderId, action, handledById, // Optional: ID người xử lý (nếu có)
note) => {
    const order = await (0, manageOrder_db_1.findOrderById)(orderId);
    if (!order)
        throw new Error("Đơn hàng không tồn tại");
    if (order.cancelStatus !== enum_1.ECancelStatus.REQUESTED) {
        throw new Error("Không có yêu cầu hủy nào đang chờ xử lý");
    }
    // Ghi người xử lý: dùng ID thật nếu có, không thì fallback chung
    const processor = handledById?.trim() ? handledById.trim() : "ADMIN_OR_STAFF";
    order.cancelHandledBy = processor;
    // Chuẩn bị text mô tả người xử lý cho lịch sử note
    const processorText = handledById?.trim()
        ? `Nhân viên (ID: ${handledById.trim()})`
        : "Nhân viên";
    if (action === "approve") {
        if ([enum_1.EOrderStatus.DELIVERING, enum_1.EOrderStatus.COMPLETED].includes(order.status)) {
            throw new Error("Không thể duyệt hủy khi đơn đang giao hoặc đã hoàn thành");
        }
        order.status = enum_1.EOrderStatus.CANCELED;
        order.cancelStatus = enum_1.ECancelStatus.APPROVED;
        order.cancelNote = note?.trim() || "Duyệt hủy theo yêu cầu khách hàng";
        // Ghi lịch sử duyệt
        const historyNote = note?.trim()
            ? ` | ${processorText} duyệt hủy: ${note.trim()}`
            : ` | ${processorText} duyệt hủy đơn`;
        if (order.orderInfo) {
            order.orderInfo.note = (order.orderInfo.note || "") + historyNote;
            await (0, manageOrder_db_1.saveOrderInfo)(order.orderInfo);
        }
    }
    else {
        // action === "reject"
        order.cancelStatus = enum_1.ECancelStatus.REJECTED;
        order.cancelNote = note?.trim() ? `Từ chối: ${note.trim()}` : "Từ chối yêu cầu hủy";
        // Ghi lịch sử từ chối
        const historyNote = note?.trim()
            ? ` | ${processorText} từ chối hủy: ${note.trim()}`
            : " | ${processorText} từ chối yêu cầu hủy";
        if (order.orderInfo) {
            order.orderInfo.note = (order.orderInfo.note || "") + historyNote;
            await (0, manageOrder_db_1.saveOrderInfo)(order.orderInfo);
        }
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
        .leftJoinAndSelect("orderDetail.item", "item")
        .leftJoinAndSelect("order.payment", "payment")
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
    const note = order.orderInfo?.note || "";
    // Tính subtotal và tạo bảng sản phẩm với căn chỉnh đẹp
    let subtotal = 0;
    let productRows = "";
    if (order.orderDetails && order.orderDetails.length > 0) {
        order.orderDetails.forEach((detail) => {
            const item = detail.item;
            const name = item?.name || "Sản phẩm không xác định";
            const quantity = detail.quantity || 0;
            const price = item?.price || 0;
            const lineTotal = price * quantity;
            subtotal += lineTotal;
            productRows += `
        <tr style="font-size: 15px;">
          <td style="padding: 12px 8px; border-bottom: 1px solid #eee;">${name}</td>
          <td align="center" style="padding: 12px 8px; border-bottom: 1px solid #eee; width: 15%;">${quantity}</td>
          <td align="right" style="padding: 12px 8px; border-bottom: 1px solid #eee; width: 20%;">${price.toLocaleString("vi-VN")} VND</td>
          <td align="right" style="padding: 12px 8px; border-bottom: 1px solid #eee; width: 20%; font-weight: bold;">${lineTotal.toLocaleString("vi-VN")} VND</td>
        </tr>
      `;
        });
    }
    else {
        productRows = `<tr><td colspan="4" align="center" style="padding: 20px; color: #999;">Không có sản phẩm</td></tr>`;
    }
    // Các khoản thanh toán
    const vatAmount = subtotal * 0.1;
    const shippingFee = 30000;
    const discountAmount = -50000;
    const total = subtotal + vatAmount + shippingFee + discountAmount;
    const formatVND = (amount) => Math.abs(amount).toLocaleString("vi-VN");
    return html
        .replace(/{{orderId}}/g, String(order.id || ""))
        .replace(/{{customerName}}/g, order.customer?.fullName || "Khách lẻ")
        .replace(/{{phone}}/g, order.customer?.phoneNumber || "-")
        .replace(/{{date}}/g, new Date(order.createAt).toLocaleDateString("vi-VN"))
        .replace(/{{status}}/g, String(order.status ?? ""))
        .replace(/{{productRows}}/g, productRows)
        .replace(/{{subtotal}}/g, formatVND(subtotal))
        .replace(/{{vatAmount}}/g, formatVND(vatAmount))
        .replace(/{{shippingFee}}/g, formatVND(shippingFee))
        .replace(/{{discountAmount}}/g, formatVND(discountAmount))
        .replace(/{{total}}/g, formatVND(total))
        .replace(/{{note}}/g, note ? `<p style="margin-top: 30px; font-style: italic; color: #555;"><strong>Ghi chú:</strong> ${note}</p>` : "");
};
exports.generateInvoiceHTML = generateInvoiceHTML;
