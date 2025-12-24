import axios from "../api/axios.config";

export const getOrders = (filters = {}) => {
  return axios.get("/orders", { params: filters });
};

export const updateOrderStatus = (id: number, newStatus: string) => {
  return axios.patch(`/orders/${id}/status`, { newStatus });
};

export const cancelOrder = (id: number, cancelReason: string) => {
  return axios.patch(`/orders/${id}/cancel`, { cancelReason });
};

export const printInvoice = (id: number) => {
  window.open(
    `http://localhost:5000/api/orders/${id}/print`,
    "_blank"
  );
};
