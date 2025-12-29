"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printInvoice = exports.handleCancel = exports.requestCancel = exports.cancel = exports.updateStatus = exports.getDetail = exports.getOrders = void 0;
const enum_1 = require("../entity/enum/enum");
const manageOrder_service_1 = require("../services/manageOrder.service");
/* ================== GET ================== */
const getOrders = async (req, res) => {
    try {
        const orders = await (0, manageOrder_service_1.getOrderList)(req.query);
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: error.message || "Lỗi server" });
    }
};
exports.getOrders = getOrders;
const getDetail = async (req, res) => {
    try {
        const orderId = Number(req.params.id);
        if (isNaN(orderId)) {
            return res.status(400).json({ message: "ID đơn hàng không hợp lệ" });
        }
        const order = await (0, manageOrder_service_1.getOrderDetail)(orderId);
        res.json(order);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};
exports.getDetail = getDetail;
/* ================== UPDATE STATUS ================== */
const updateStatus = async (req, res) => {
    try {
        const orderId = Number(req.params.id);
        const { newStatus } = req.body;
        if (!Object.values(enum_1.EOrderStatus).includes(newStatus)) {
            return res.status(400).json({ message: "Trạng thái không hợp lệ" });
        }
        const order = await (0, manageOrder_service_1.updateOrderStatus)(orderId, newStatus);
        res.json({ message: "Cập nhật trạng thái thành công", order });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateStatus = updateStatus;
/* ================== STAFF CANCEL (TRỰC TIẾP) ================== */
const cancel = async (req, res) => {
    try {
        const orderId = Number(req.params.id);
        const { cancelReason } = req.body;
        if (!cancelReason?.trim()) {
            return res.status(400).json({ message: "Vui lòng nhập lý do hủy" });
        }
        const order = await (0, manageOrder_service_1.cancelOrder)(orderId, cancelReason.trim());
        res.json({ message: "Hủy đơn thành công", order });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.cancel = cancel;
/* ================== CUSTOMER REQUEST CANCEL ================== */
const requestCancel = async (req, res) => {
    try {
        const orderId = Number(req.params.id);
        const userId = req.user?.id;
        const { reason } = req.body;
        if (!userId) {
            return res.status(401).json({ message: "Chưa đăng nhập" });
        }
        if (!reason?.trim()) {
            return res.status(400).json({ message: "Vui lòng nhập lý do hủy" });
        }
        const order = await (0, manageOrder_service_1.requestCancelOrder)(orderId, userId, reason.trim());
        res.json({ message: "Đã gửi yêu cầu hủy đơn", order });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.requestCancel = requestCancel;
/* ================== STAFF HANDLE CANCEL ================== */
const handleCancel = async (req, res) => {
    try {
        const orderId = Number(req.params.id);
        const { action, note } = req.body;
        const staffId = req.user?.id;
        if (!staffId) {
            return res.status(401).json({ message: "Không có quyền" });
        }
        if (!["approve", "reject"].includes(action)) {
            return res.status(400).json({ message: "Hành động không hợp lệ" });
        }
        const order = await (0, manageOrder_service_1.handleCancelRequest)(orderId, action, String(staffId), note);
        res.json({
            message: action === "approve"
                ? "Đã duyệt hủy đơn"
                : "Đã từ chối yêu cầu hủy",
            order,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.handleCancel = handleCancel;
/* ================== PRINT INVOICE ================== */
const printInvoice = async (req, res) => {
    try {
        const orderId = Number(req.params.id);
        const order = await (0, manageOrder_service_1.getOrderDetail)(orderId);
        const html = (0, manageOrder_service_1.generateInvoiceHTML)(order);
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.send(html);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.printInvoice = printInvoice;
