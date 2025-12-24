import API from "../api/axois.config"; // giả sử là axios instance

export type OrderDetailItem = {
  itemInfo: {
    image?: string;
    name?: string;
    price?: number;
    flavor?: string;
    [key: string]: any;
  };
  note?: string | null;
  quantity: number;
};

export type OrderItem = {
  id: number;
  createAt: string;
  deliveryAt?: string | null;
  status: string;            // PENDING, CONFIRMED, ...
  payStatus: string;         // PENDING, PAID, REFUNDED
  cancelStatus?: string;     // NONE, REQUESTED, APPROVED, REJECTED
  orderDetails: OrderDetailItem[];
};

export type OrderSummary = {
  message?: string;
  orders: OrderItem[];
};

// Response chi tiết trạng thái đơn hàng
export type OrderStatusResponse = {
  orderId: number;
  status: string;
  statusText: string;
  createdAt: string;
  deliveryAt?: string | null;
  payStatus: string;                    // THÊM
  cancelStatus?: string;                // THÊM
  payment?: {
    method: string;                     // COD, VNPAY, ...
    status: string;                     // PENDING, PAID
  } | null;
  timeline: {
    status?: string;
    label: string;
    completed: boolean;
  }[];
  items: OrderDetailItem[];             // đổi tên từ orderDetails → items cho dễ dùng
};

// Response khi hủy/yêu cầu hủy đơn
export type CancelOrderResponse = {
  message: string;
  action?: "canceled_directly" | "cancel_requested";
};

// ==================== Các hàm gọi API ====================

export const orderService = {
  // 1. Lấy danh sách đơn hàng của tôi
  getMyOrders: async (): Promise<OrderSummary> => {
    const res = await API.get("/my-orders");
    return res.data;
  },

  // 2. Xem trạng thái chi tiết một đơn hàng
  getOrderStatus: async (orderId: number): Promise<OrderStatusResponse> => {
    const res = await API.get(`/${orderId}/status`);
    return res.data;
  },

  // 3. Hủy hoặc yêu cầu hủy đơn hàng
  cancelOrder: async (orderId: number): Promise<CancelOrderResponse> => {
    const res = await API.post(`/${orderId}/cancel`);
    return res.data; // backend trả về { message, action? }
  },
};