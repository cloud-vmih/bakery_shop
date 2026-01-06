import API from "../api/axois.config"; // giả sử là axios instance

export type OrderDetailItem = {
  item: {
    imageURL?: string;
    name?: string;
    price?: number;
    flavor?: string;
    discounts: any;
    membershipDiscounts: any;
    [key: string]: any;
  };
  quantity: number;
};

export type OrderItem = {
  id: number;
  createAt: string;
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
  payStatus: string;                    // THÊM
  cancelStatus?: string;                // THÊM
  cancelReason?: string;
  payment?: {
    method: string;                     // COD, VNPAY, ...
    status: string;                     // PENDING, PAID
  } | null;
  timeline: {
    status?: string;
    label: string;
    completed: boolean;
  }[];
  items: OrderDetailItem[];
  note?: string;
  branchId: number ;
  address: any ;
};

// Response khi hủy/yêu cầu hủy đơn
export type CancelOrderResponse = {
  message: string;
  action?: "canceled_directly" | "cancel_requested";
};

export const processCustomerCancelRequest = (
  orderId: number,
  action: "approve" | "reject",
  note?: string
) => {
  // Endpoint đúng là /manage-orders/:id/handle-cancel (PATCH)
  return API.patch( `/manage-orders/${orderId}/handle-cancel`, { action, note });
};

// ==================== Các hàm gọi API ====================

export const orderService = {
  // 1. Lấy danh sách đơn hàng của tôi
  getMyOrders: async (): Promise<OrderSummary> => {
    const res = await API.get("/order/my-orders");
    return res.data;
  },

  // 2. Xem trạng thái chi tiết một đơn hàng
  getOrderStatus: async (orderId: number): Promise<OrderStatusResponse> => {
    const res = await API.get(`/order/${orderId}/status`);
    return res.data;
  },

  // 3. Hủy hoặc yêu cầu hủy đơn hàng
cancelOrder: async (orderId: number, reason: string): Promise<CancelOrderResponse> => {
  const res = await API.post(`/order/${orderId}/cancel`, { reason }); // ← gửi reason
  return res.data;
},
};

export const getOrders = (filters = {}) => {
  return API.get("/manage-orders", { params: filters });
};

export const updateOrderStatus = (id: number, newStatus: string) => {
  return API.patch(`/manage-orders/${id}/status`, { newStatus });
};

export const cancelOrder = (id: number, cancelReason: string) => {
  return API.patch(`/manage-orders/${id}/cancel`, { cancelReason });
};

export const printInvoice = (id: number) => {
  window.open(
    `http://localhost:5000/api/manage-orders/${id}/print`,
    "_blank"
  );
};
