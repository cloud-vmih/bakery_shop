"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrder = exports.getOrderStatus = exports.getMyOrders = void 0;
// server/src/services/order.service.ts
const order_db_1 = require("../db/order.db");
const enum_1 = require("../entity/enum/enum");
const sendEmail_1 = require("../helpers/sendEmail");
const user_db_1 = require("../db/user.db");
// Hàm chuyển trạng thái sang tiếng Việt
const getStatusText = (status) => {
    const map = {
        [enum_1.EOrderStatus.PENDING]: "Chờ xác nhận",
        [enum_1.EOrderStatus.CONFIRMED]: "Đã xác nhận",
        [enum_1.EOrderStatus.PREPARING]: "Đang chuẩn bị",
        [enum_1.EOrderStatus.DELIVERING]: "Đang giao",
        [enum_1.EOrderStatus.COMPLETED]: "Giao thành công",
        [enum_1.EOrderStatus.CANCELED]: "Đã hủy",
    };
    return map[status] || "Không xác định";
};
// Tạo timeline tiến trình
const buildTimeline = (currentStatus) => {
    const steps = [
        { status: enum_1.EOrderStatus.PENDING, label: "Chờ xác nhận" },
        { status: enum_1.EOrderStatus.CONFIRMED, label: "Đã xác nhận" },
        { status: enum_1.EOrderStatus.PREPARING, label: "Đang chuẩn bị" },
        { status: enum_1.EOrderStatus.DELIVERING, label: "Đang giao" },
        { status: enum_1.EOrderStatus.COMPLETED, label: "Giao thành công" },
    ];
    // Trường hợp đã hủy
    if (currentStatus === enum_1.EOrderStatus.CANCELED) {
        return [{ label: "Đơn hàng đã bị hủy", completed: true }];
    }
    // Tính toán completed cho từng bước
    const currentIndex = steps.findIndex((s) => s.status === currentStatus);
    return steps.map((step, idx) => ({
        ...step,
        completed: idx <= currentIndex,
    }));
};
// Lấy danh sách đơn hàng của khách
const getMyOrders = async (userId) => {
    const orders = await order_db_1.orderRepo.findByCustomerId(userId);
    console.log("Orders fetched for user", userId, ":", orders[0]);
    if (!orders || orders.length === 0) {
        return {
            message: "Bạn chưa có đơn hàng nào.",
            orders: [],
        };
    }
    return {
        orders,
    };
};
exports.getMyOrders = getMyOrders;
// Lấy chi tiết trạng thái một đơn hàng
const getOrderStatus = async (orderId, userId) => {
    const order = await order_db_1.orderRepo.findOneByIdAndCustomer(orderId, userId);
    if (!order) {
        return null;
    }
    const status = order.status ?? enum_1.EOrderStatus.PENDING;
    const timeline = buildTimeline(status);
    return {
        orderId: order.id,
        status,
        statusText: getStatusText(status),
        createdAt: order.createAt,
        payStatus: order.payment?.status ?? enum_1.EPayStatus.PENDING, // THÊM DÒNG NÀY
        cancelStatus: order.cancelStatus ?? enum_1.ECancelStatus.NONE,
        cancelReason: order.cancelReason || null,
        timeline,
        payment: order.payment ? {
            method: order.payment.paymentMethod, // ví dụ: "COD", "VNPAY"
            status: order.payment.status, // "PAID", "PENDING", "REFUNDED"
        } : null,
        items: order.orderDetails?.map((detail) => ({
            item: detail.item || {},
            quantity: detail.quantity ?? detail.item?.quantity ?? 1, // ưu tiên quantity riêng, fallback itemInfo
        })) || [],
        note: order.orderInfo?.note || null,
        branchId: order.orderInfo?.branchId || null,
        address: order.orderInfo?.address,
    };
};
exports.getOrderStatus = getOrderStatus;
/**
 * Hủy đơn hàng - theo trạng thái thanh toán
 */
const cancelOrder = async (orderId, userId, reason) => {
    // 1. Tìm đơn hàng của user
    const order = await order_db_1.orderRepo.findOneByIdAndCustomer(orderId, userId);
    if (!order) {
        return {
            success: false,
            message: "Đơn hàng không tồn tại hoặc không thuộc về bạn",
        };
    }
    const currentStatus = order.status ?? enum_1.EOrderStatus.PENDING;
    const payStatus = order.payment?.status ?? enum_1.EPayStatus.PENDING;
    const cancelStatus = order.cancelStatus ?? enum_1.ECancelStatus.NONE;
    // 2. Kiểm tra trạng thái đơn hàng có được phép hủy không
    if (![enum_1.EOrderStatus.PENDING, enum_1.EOrderStatus.CONFIRMED].includes(currentStatus)) {
        return {
            success: false,
            message: "Đơn hàng không thể hủy vì đã bắt đầu chuẩn bị hoặc đang giao.",
        };
    }
    // 3. Kiểm tra xem đã có yêu cầu hủy nào chưa
    if (cancelStatus !== enum_1.ECancelStatus.NONE) {
        if (cancelStatus === enum_1.ECancelStatus.REQUESTED) {
            return {
                success: false,
                message: "Đơn hàng đang được xử lý yêu cầu hủy. Vui lòng chờ phản hồi từ cửa hàng.",
            };
        }
        if (cancelStatus === enum_1.ECancelStatus.APPROVED) {
            return {
                success: false,
                message: "Đơn hàng đã được hủy thành công.",
            };
        }
        if (cancelStatus === enum_1.ECancelStatus.REJECTED) {
            return {
                success: false,
                message: "Yêu cầu hủy đã bị từ chối. Đơn hàng sẽ tiếp tục được xử lý.",
            };
        }
    }
    // 4. Trường hợp CHƯA THANH TOÁN → Hủy trực tiếp
    if (payStatus === enum_1.EPayStatus.PENDING) {
        order.status = enum_1.EOrderStatus.CANCELED;
        order.cancelStatus = enum_1.ECancelStatus.NONE; // Không cần lưu trạng thái yêu cầu
        if (reason?.trim()) {
            order.cancelReason = reason.trim(); // ← LƯU LÝ DO
        }
        await order_db_1.orderRepo.save(order);
        return {
            success: true,
            message: "Đơn hàng đã được hủy thành công!",
            action: "canceled_directly",
        };
    }
    // 5. Trường hợp ĐÃ THANH TOÁN → Gửi yêu cầu hủy, chờ admin duyệt
    if (payStatus === enum_1.EPayStatus.PAID) {
        order.cancelStatus = enum_1.ECancelStatus.REQUESTED;
        // Giữ nguyên status (PENDING/CONFIRMED) để admin có thể xử lý tiếp
        if (reason?.trim()) {
            order.cancelReason = reason.trim(); // ← LƯU LÝ DO
        }
        await order_db_1.orderRepo.save(order);
        const customer = await (0, user_db_1.getUserById)(userId);
        await sendEmail_1.emailService.sendRefundForm(customer.email, customer.fullName, String(orderId), 'https://docs.google.com/forms/d/e/1FAIpQLSf-Yh0jF8aH-G-JCGDnmHkMAcBE6XP_SUvDK4CsxnbBDrB-vQ/viewform?usp=header');
        // TODO: Gửi thông báo cho admin (notification, email, dashboard alert...)
        // await notifyAdminCancelRequest(order);
        return {
            success: true,
            message: "Yêu cầu hủy đơn hàng đã được gửi. Chúng tôi sẽ xử lý và hoàn tiền sớm nhất có thể.",
            action: "cancel_requested",
        };
    }
    // 6. Trường hợp REFUNDED hoặc trạng thái không hợp lệ
    if (payStatus === enum_1.EPayStatus.REFUNDED) {
        return {
            success: false,
            message: "Đơn hàng đã được hoàn tiền, không thể hủy thêm.",
        };
    }
    // Trường hợp không rơi vào bất kỳ case nào (phòng ngừa)
    return {
        success: false,
        message: "Không thể xử lý yêu cầu hủy do trạng thái đơn hàng không hợp lệ.",
    };
};
exports.cancelOrder = cancelOrder;
