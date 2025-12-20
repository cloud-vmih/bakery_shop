// src/services/payment.services.ts
import API from "../api/axois.config";

export const getPaymentByOrder = async (orderId: number) => {
  try {
    const res = await API.get(`/payment/order/${orderId}`);
    return res.data;
  } catch (err: any) {
    throw new Error("GET_PAYMENT_FAILED");
  }
};
