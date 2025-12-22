// src/services/orders.service.ts
import API from "../api/axois.config";

/** ================= TYPES ================= */
export type CreateOrderResponse = {
  orderId: number;
  orderStatus: "PENDING" | "CONFIRMED";
  paymentMethod: "COD" | "VNPAY";
};

/**
 * ================= CREATE ORDER =================
 * POST /api/orders
 *
 * - COD   → order CONFIRMED
 * - VNPAY → order PENDING
 */
export const createOrder = async (
  payload: any
): Promise<CreateOrderResponse> => {
  const res = await API.post("/orders", payload);
  return res.data;
};

/**
 * ================= GET ORDER BY ID =================
 * GET /api/orders/:orderId
 *
 * - Dùng cho Success page
 * - Source of truth từ DB
 */
export const getOrderById = async (orderId: number) => {
  const res = await API.get(`/orders/${orderId}`);
  return res.data;
};
