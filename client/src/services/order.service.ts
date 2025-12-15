import API from "../api/axois.config";
// ==================== Định nghĩa kiểu trả về (rất quan trọng cho TS) ====================
// services/order.service.ts
export type OrderDetailItem = {
  itemInfo: {
    image: string,
    name: string  
    [key: string]: any;
  };
  note?: string | null;
  quantity: number;
};

export type OrderItem = {
  id: number;
  createAt: string;
  deliveryAt: string;
  status: string;
  orderDetails: OrderDetailItem[];
};

export type OrderSummary = {
  message?: string;
  orders: OrderItem[];
};

export type OrderStatusResponse = {
    orderId: number;
    status: string;
    statusText: string;
    createdAt: string;
    deliveryAt: string;
    payment: {
      method: string;
      status: string;
    }[];
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
    getMyOrders: async (): Promise<OrderSummary> => {
        const res = await API.get("/my-orders");
        return res.data;
    },

    // 2. Xem trạng thái chi tiết 1 đơn hàng
    getOrderStatus: async (orderId: number): Promise<OrderStatusResponse> => {
        const res = await API.get(`/${orderId}/status`);
        return res.data;
    },
    cancelOrder: async (orderId: number): Promise<void> => {
    const res = await API.post(`/${orderId}/cancel`);
    return res.data;
  },
};