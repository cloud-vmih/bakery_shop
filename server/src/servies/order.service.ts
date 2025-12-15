// server/src/services/order.service.ts

import { orderRepo } from "../db/order.db";
import { EOrderStatus } from "../entity/enum/enum";

// Hàm chuyển trạng thái sang tiếng Việt
const getStatusText = (status: EOrderStatus): string => {
  const map: Record<EOrderStatus, string> = {
    [EOrderStatus.PENDING]: "Chờ xác nhận",
    [EOrderStatus.CONFIRMED]: "Đã xác nhận",
    [EOrderStatus.PREPARING]: "Đang chuẩn bị hàng",
    [EOrderStatus.DELIVERING]: "Đang giao",
    [EOrderStatus.COMPLETED]: "Giao thành công",
    [EOrderStatus.CANCELED]: "Đã hủy",
  };
  return map[status] || "Không xác định";
};

// Tạo timeline tiến trình
const buildTimeline = (currentStatus: EOrderStatus) => {
  const steps = [
    { status: EOrderStatus.PENDING, label: "Chờ xác nhận" },
    { status: EOrderStatus.CONFIRMED, label: "Đã xác nhận" },
    { status: EOrderStatus.PREPARING, label: "Đang chuẩn bị hàng" },
    { status: EOrderStatus.DELIVERING, label: "Đang giao" },
    { status: EOrderStatus.COMPLETED, label: "Giao thành công" },
  ];

  // Trường hợp đã hủy
  if (currentStatus === EOrderStatus.CANCELED) {
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
export const getMyOrders = async (userId: number) => {
  const orders = await orderRepo.findByCustomerId(userId);

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

// Lấy chi tiết trạng thái một đơn hàng
export const getOrderStatus = async (orderId: number, userId: number) => {
  const order = await orderRepo.findOneByIdAndCustomer(orderId, userId);

  if (!order) {
    return null;
  }

  const status = order.status ?? EOrderStatus.PENDING;
  const timeline = buildTimeline(status);

  return {
    orderId: order.id,
    status,
    statusText: getStatusText(status),
    createdAt: order.createAt,
    deliveryAt: order.deliveryAt || null,
    timeline,
    payment: order.payment ? {
    method: order.payment.paymentMethod,           // ví dụ: "COD", "VNPAY", "MOMO"
    status: order.payment.status,           // "PAID", "PENDING", "REFUNDED"
  } : null,
    items: order.orderDetails?.map((detail: any) => ({
      itemInfo: detail.itemInfo || {},
      note: detail.note || null,
      quantity: detail.quantity ?? detail.itemInfo?.quantity ?? 1, // ưu tiên quantity riêng, fallback itemInfo
    })) || [],
  };
};

// Hủy đơn hàng
export const cancelOrder = async (orderId: number, userId: number) => {
  const order = await orderRepo.findOneByIdAndCustomer(orderId, userId);

  if (!order) {
    return { success: false, message: "Đơn hàng không tồn tại hoặc không thuộc về bạn" };
  }
  const status: EOrderStatus = order.status ?? EOrderStatus.PENDING;

  // Chỉ cho phép hủy ở trạng thái PENDING hoặc CONFIRMED
  if (![EOrderStatus.PENDING, EOrderStatus.CONFIRMED].includes(status)) {
    return { success: false, message: "Đơn hàng không thể hủy vì đã được xử lý" };
  }

  // Cập nhật trạng thái
  order.status = EOrderStatus.CANCELED;
  await orderRepo.save(order);

  // TODO: Gửi email thông báo hủy đơn (nếu cần)
  // await sendCancelEmail(order);

  return { success: true, message: "Đơn hàng đã được hủy thành công" };
};