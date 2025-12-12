// server/src/services/order.service.ts

import { orderRepo } from "../db/order.db";
import { EOrderStatus } from "../entity/enum/enum";

// Hàm chuyển tiếng Việt
const getStatusText = (status: EOrderStatus): string => {
  const map: Record<EOrderStatus, string> = {
    [EOrderStatus.PENDING]:    "Chờ xác nhận",
    [EOrderStatus.CONFIRMED]:  "Đã xác nhận",
    [EOrderStatus.PREPARING]:  "Đang chuẩn bị hàng",
    [EOrderStatus.DELIVERING]: "Đang giao",
    [EOrderStatus.COMPLETED]:  "Giao thành công",
    [EOrderStatus.CANCELED]:   "Đã hủy",
  };
  return map[status] || "Không xác định";
};

// Tạo timeline
const buildTimeline = (currentStatus: EOrderStatus) => {
  const steps = [
    { status: EOrderStatus.PENDING,    label: "Chờ xác nhận" },
    { status: EOrderStatus.CONFIRMED,  label: "Đã xác nhận" },
    { status: EOrderStatus.PREPARING,  label: "Đang chuẩn bị hàng" },
    { status: EOrderStatus.DELIVERING, label: "Đang giao" },
    { status: EOrderStatus.COMPLETED,  label: "Giao thành công" },
  ];

  if (currentStatus === EOrderStatus.CANCELED) {
    return [{ label: "Đơn hàng đã bị hủy", completed: true }];
  }

  return steps.map((step) => ({
    ...step,
    completed:
      steps.findIndex((s) => s.status === currentStatus) >=
      steps.findIndex((s) => s.status === step.status),
  }));
};

// Các hàm service export ra controller dùng
export const getMyOrders = async (userId: number) => {
  const orders = await orderRepo.findByCustomerId(userId);

  if (!orders) {
    return { message: "Bạn chưa có đơn hàng nào.", orders: [] };
  }

  return { message: "Tất cả đơn hàng của bạn.", orders};
};

export const getOrderStatus = async (orderId: number, userId: number) => {
  const order = await orderRepo.findOneByIdAndCustomer(orderId, userId);

  if (!order) {
    return null;
  }

  // Đảm bảo status luôn có giá trị (an toàn tuyệt đối)
  const status = order.status ?? EOrderStatus.PENDING;

  const timeline = buildTimeline(status);

  const result = {
    orderId: order.id,
    status,
    statusText: getStatusText(status),
    createdAt: order.createAt,
    timeline,
  };

//   if (status === EOrderStatus.PENDING) {
//     result.message = "Đơn hàng đang chờ được xác nhận.";
//   }

  return result;
};