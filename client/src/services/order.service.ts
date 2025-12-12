import API from "../api/axois.config";
// ==================== Định nghĩa kiểu trả về (rất quan trọng cho TS) ====================

export type OrderSummary = {
  id: number;
  createAt: string;
  status: string;
};

export type OrderStatusResponse = {
  orderId: number;
  status: string;
  statusText: string;
  createdAt: string;
  lastUpdate: string;
  shippingProvider: string;
  trackingNumber: string | null;
  timeline: {
    status?: string;
    label: string;
    completed: boolean;
  }[];
  message?: string;
};

// ==================== Các hàm gọi API ====================

export const orderService = {
  // 1. Lấy danh sách đơn hàng của tôi
  getMyOrders: async (): Promise<{
    orders: OrderSummary[];
    message?: string;
  }> => {
    const res = await API.get("/my-orders");
    return res.data;
  },

  // 2. Xem trạng thái chi tiết 1 đơn hàng
  getOrderStatus: async (orderId: number): Promise<OrderStatusResponse> => {
    const res = await API.get(`/${orderId}/status`);
    return res.data;
  },
};