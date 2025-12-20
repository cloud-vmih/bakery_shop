// src/services/orders.services.ts
import API from "../api/axois.config";

export type CreateOrderResponse = {
  orderId: number;
  orderStatus: string;
  paymentMethod: string;
};

export const createOrder = async (
  payload: any
): Promise<CreateOrderResponse> => {
  try {
    const res = await API.post("/orders", payload);
    return res.data;
  } catch (err: any) {
    console.error("CREATE ORDER ERROR >>>", err.response?.data);

    throw new Error(err.response?.data?.message || "CREATE_ORDER_FAILED");
  }
};
