// src/services/cart.services.ts
import toast from "react-hot-toast";
import API from "../api/axois.config";

/** ===== TYPES ===== */
export type CartItemType = {
  id: number;
  quantity: number;
  item: {
    id: number;
    name: string;
    price: number;
    imageURL?: string;
  };
};

export type CartResponse = {
  items: CartItemType[];
  totalItems: number;
};

/** ===== ADD TO CART ===== */
export const addToCart = async (itemId: number, quantity = 1) => {
  try {
    toast.success("Đã thêm vào giỏ hàng");
    await API.post("/cart", { itemId, quantity });
    return true;
  } catch (err: any) {
    if (err.response?.status === 401) {
      throw new Error("NEED_LOGIN");
    }
    throw new Error("ADD_TO_CART_FAILED");
  }
};

/** ===== LOAD CART ===== */
export const getCart = async (): Promise<CartResponse> => {
  const res = await API.get("/cart");
  return res.data;
};

/** ===== UPDATE QUANTITY ===== */
export const updateCartItem = async (cartItemId: number, quantity: number) => {
  await API.put(`/cart/item/${cartItemId}`, { quantity });
};

/** ===== REMOVE ONE ITEM ===== */
export const removeCartItem = async (cartItemId: number) => {
  await API.delete(`/cart/item/${cartItemId}`);
};

/** ===== CLEAR CART ===== */
export const clearCart = async () => {
  await API.delete("/cart");
};
