// server/src/services/order.service.ts
import { orderRepo } from "../db/order.db";
import { EOrderStatus, ECancelStatus, EPayStatus } from "../entity/enum/enum";
import { emailService } from "../helpers/sendEmail"
import { getUserById } from "../db/user.db"


interface CancelResult {
  success: boolean;
  message: string;
  action?: "canceled_directly" | "cancel_requested";
}

// Hàm chuyển trạng thái sang tiếng Việt
const getStatusText = (status: EOrderStatus): string => {
  const map: Record<EOrderStatus, string> = {
    [EOrderStatus.PENDING]: "Chờ xác nhận",
    [EOrderStatus.CONFIRMED]: "Đã xác nhận",
    [EOrderStatus.PREPARING]: "Đang chuẩn bị",
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
    { status: EOrderStatus.PREPARING, label: "Đang chuẩn bị" },
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

// Lấy chi tiết trạng thái một đơn hàng
export const getOrderStatus = async (orderId: number, userId: number) => {
  const order = await orderRepo.findOneByIdAndCustomer(orderId, userId);
  console.log("Order fetched:", order);
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
    payStatus: order.payment?.status ?? EPayStatus.PENDING,        // THÊM DÒNG NÀY
    cancelStatus: order.cancelStatus ?? ECancelStatus.NONE,
    timeline,
    payment: order.payment ? {
      method: order.payment.paymentMethod,           // ví dụ: "COD", "VNPAY"
      status: order.payment.status,           // "PAID", "PENDING", "REFUNDED"
    } : null,
    items: order.orderDetails?.map((detail: any) => ({
      item: detail.item || {},
      quantity: detail.quantity ?? detail.item?.quantity ?? 1, // ưu tiên quantity riêng, fallback itemInfo
    })) || [],
    note: order.orderInfo?.note || null,
  };
};

interface CancelResult {
  success: boolean;
  message: string;
  action?: "canceled_directly" | "cancel_requested"; // để frontend xử lý thông báo phù hợp
}
/**
 * Hủy đơn hàng - theo trạng thái thanh toán
 */
export const cancelOrder = async (
  orderId: number,
  userId: number
): Promise<CancelResult> => {
  // 1. Tìm đơn hàng của user
  const order = await orderRepo.findOneByIdAndCustomer(orderId, userId);

  if (!order) {
    return {
      success: false,
      message: "Đơn hàng không tồn tại hoặc không thuộc về bạn",
    };
  }

  const currentStatus = order.status ?? EOrderStatus.PENDING;
  const payStatus = order.payment?.status ?? EPayStatus.PENDING;
  const cancelStatus = order.cancelStatus ?? ECancelStatus.NONE;

  // 2. Kiểm tra trạng thái đơn hàng có được phép hủy không
  if (![EOrderStatus.PENDING, EOrderStatus.CONFIRMED].includes(currentStatus)) {
    return {
      success: false,
      message: "Đơn hàng không thể hủy vì đã bắt đầu chuẩn bị hoặc đang giao.",
    };
  }

  // 3. Kiểm tra xem đã có yêu cầu hủy nào chưa
  if (cancelStatus !== ECancelStatus.NONE) {
    if (cancelStatus === ECancelStatus.REQUESTED) {
      return {
        success: false,
        message: "Đơn hàng đang được xử lý yêu cầu hủy. Vui lòng chờ phản hồi từ cửa hàng.",
      };
    }
    if (cancelStatus === ECancelStatus.APPROVED) {
      return {
        success: false,
        message: "Đơn hàng đã được hủy thành công.",
      };
    }
    if (cancelStatus === ECancelStatus.REJECTED) {
      return {
        success: false,
        message: "Yêu cầu hủy đã bị từ chối. Đơn hàng sẽ tiếp tục được xử lý.",
      };
    }
  }

  // 4. Trường hợp CHƯA THANH TOÁN → Hủy trực tiếp
  if (payStatus === EPayStatus.PENDING) {
    order.status = EOrderStatus.CANCELED;
    order.cancelStatus = ECancelStatus.NONE; // Không cần lưu trạng thái yêu cầu

    await orderRepo.save(order);

    return {
      success: true,
      message: "Đơn hàng đã được hủy thành công!",
      action: "canceled_directly",
    };
  }

  // 5. Trường hợp ĐÃ THANH TOÁN → Gửi yêu cầu hủy, chờ admin duyệt
  if (payStatus === EPayStatus.PAID) {
    order.cancelStatus = ECancelStatus.REQUESTED;
    // Giữ nguyên status (PENDING/CONFIRMED) để admin có thể xử lý tiếp

    await orderRepo.save(order);

    const customer = await getUserById(userId)
    await emailService.sendRefundForm(customer!.email, customer!.fullName, String(orderId) ,'https://docs.google.com/forms/d/e/1FAIpQLSf-Yh0jF8aH-G-JCGDnmHkMAcBE6XP_SUvDK4CsxnbBDrB-vQ/viewform?usp=header');

    // TODO: Gửi thông báo cho admin (notification, email, dashboard alert...)
    // await notifyAdminCancelRequest(order);

    return {
      success: true,
      message: "Yêu cầu hủy đơn hàng đã được gửi. Chúng tôi sẽ xử lý và hoàn tiền sớm nhất có thể.",
      action: "cancel_requested",
    };
  }

  // 6. Trường hợp REFUNDED hoặc trạng thái không hợp lệ
  if (payStatus === EPayStatus.REFUNDED) {
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
