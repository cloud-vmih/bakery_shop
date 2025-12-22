// src/services/payment.services.ts
import API from "../api/axois.config";

/**
 * ================= GET PAYMENT BY ORDER =================
 * GET /api/payment/order/:orderId
 */
export const getPaymentByOrder = async (orderId: number) => {
  try {
    const res = await API.get(`/payment/order/${orderId}`);
    return res.data;
  } catch (err: any) {
    console.error("GET PAYMENT ERROR >>>", err.response?.data);
    throw new Error("GET_PAYMENT_FAILED");
  }
};

/**
 * ================= CREATE VNPAY URL =================
 * POST /api/payment/vnpay/create
 */
export const createVNPayUrl = async (
  orderId: number,
  amount: number
): Promise<{ vnpayUrl: string }> => {
  try {
    const res = await API.post("/payment/vnpay/create", {
      orderId,
      amount,
    });
    return res.data;
  } catch (err: any) {
    console.error("CREATE VNPAY URL ERROR >>>", err.response?.data);
    throw new Error("CREATE_VNPAY_URL_FAILED");
  }
};
