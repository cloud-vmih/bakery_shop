// src/services/cart.services.ts
import API from "../api/axois.config";
import toast from "react-hot-toast";

export const addToCart = async (itemId: number) => {
  try {
    await API.post("/cart", { itemId });  // ← gửi đúng { itemId: 2 }
    toast.success("Đã thêm vào giỏ hàng!");
  } catch (err: any) {
    if (err.response?.status === 401) {
      throw new Error("NEED_LOGIN");
    }
    toast.error(err.response?.data?.message || "Thêm vào giỏ thất bại");
  }
};