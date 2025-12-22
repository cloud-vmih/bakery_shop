// src/services/cart.services.ts
import API from "../api/axois.config";
import toast from "react-hot-toast";

export const addToCart = async (itemId: number) => {
  try {
    await API.post("/cart", { itemId });  // ← gửi đúng { itemId: 2 }
  } catch (err: any) {
    throw err
    // toast.error(err.response?.data?.message || "Thêm vào giỏ thất bại");
  }
};