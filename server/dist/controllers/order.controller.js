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
exports.OrderController = void 0;
const enum_1 = require("../entity/enum/enum");
const customerOrderService = __importStar(require("../services/order.service"));
const notification_service_1 = require("../services/notification.service");
const user_service_1 = require("../services/user.service");
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
            const adminStaffIds = await (0, user_service_1.getAdminAndStaffIds)();
            await (0, notification_service_1.sendNotification)(adminStaffIds, "Yêu cầu hủy đơn mới", `Có yêu cầu hủy đơn #${orderId} cần xử lý`, enum_1.ENotiType.ORDER, `/admin/manage-orders`);
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
