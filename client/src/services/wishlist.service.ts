// client/services/wishlist.service.ts
import API from "../api/axois.config";
import { AxiosError } from "axios";

export interface Item {
  id?: number;
  name?: string;
  description?: string;
  price?: number;
  imageURL?: string;
}

/** Lấy wishlist của user hiện tại */
export const getWishlist = async (): Promise<Item[]> => {
  try {
    const res = await API.get("/wishlist");
    return res.data;
  } catch (error) {
    const err = error as AxiosError<any>;
    throw new Error(err.response?.data?.error || "Không thể tải wishlist");
  }
};

/** Thêm sản phẩm vào wishlist */
export const addToWishlist = async (itemId: number) => {
  try {
    const res = await API.post(`/wishlist/${itemId}`);
    return res.data;
  } catch (error) {
    const err = error as AxiosError<any>;
    throw new Error(err.response?.data?.error || "Thêm sản phẩm thất bại");
  }
};

/** Xóa sản phẩm khỏi wishlist */
export const removeFromWishlist = async (itemId: number) => {
  try {
    const res = await API.delete(`/wishlist/${itemId}`);
    return res.data;
  } catch (error) {
    const err = error as AxiosError<any>;
    throw new Error(err.response?.data?.error || "Xóa sản phẩm thất bại");
  }
};
