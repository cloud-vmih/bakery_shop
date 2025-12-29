"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = exports.printInvoice = exports.handleCancel = exports.requestCancel = exports.cancel = exports.updateStatus = exports.getDetail = exports.getOrders = void 0;
const enum_1 = require("../entity/enum/enum");
const manageOrder_service_1 = require("../services/manageOrder.service");
const customerOrderService = __importStar(require("../services/order.service"));
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
// XỬ LÝ ĐƠN HÀNG BÊN PHÍA CUSTOMER
class OrderController {
    static async getMyOrders(req, res) {
        try {
            const userId = req.user.id;
            const result = await customerOrderService.getMyOrders(userId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Lỗi lấy danh sách đơn hàng:", error);
            return res.status(500).json({ message: "Lỗi server", orders: [] });
        }
    }
    static async getOrderStatus(req, res) {
        try {
            const userId = req.user.id;
            const orderId = Number(req.params.orderId);
            if (isNaN(orderId)) {
                return res.status(400).json({ message: "ID đơn hàng không hợp lệ" });
            }
            const data = await customerOrderService.getOrderStatus(orderId, userId);
            console.log("Order status data:", data);
            if (!data) {
                return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
            }
            return res.status(200).json(data);
        }
        catch (error) {
            console.error("Lỗi lấy trạng thái đơn hàng:", error);
            return res.status(500).json({ message: "Lỗi server" });
        }
    }
    static async cancelOrder(req, res) {
        try {
            const orderId = Number(req.params.orderId);
            const userId = req.user.id;
            if (isNaN(orderId)) {
                return res.status(400).json({ message: "ID đơn hàng không hợp lệ" });
            }
            const result = await customerOrderService.cancelOrder(orderId, userId);
            if (!result.success) {
                return res.status(400).json({ message: result.message });
            }
            return res.status(200).json({
                message: result.message,
                action: result.action, // để frontend hiển thị thông báo phù hợp
            });
        }
        catch (error) {
            console.error("Lỗi hủy đơn hàng:", error);
            return res.status(500).json({ message: "Lỗi hệ thống khi hủy đơn hàng" });
        }
    }
}
exports.OrderController = OrderController;
