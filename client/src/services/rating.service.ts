import API from "../api/axois.config";
import { AxiosError } from "axios";

export interface Rating {
  id: number;          // ID của bản ghi rating
  itemID: number;      // ID sản phẩm
  customerID: number;  // ID khách hàng
  contents: string;
  createAt: string;
  customer?: {
    id: number;
    fullName: string;
    avatarURL?: string;
  };
}

// Lấy đánh giá theo sản phẩm
export const getRatingsByItem = async (itemID: number): Promise<Rating[]> => {
  try {
    const res = await API.get(`/ratings/item/${itemID}`);
    return res.data;
  } catch (error) {
    const err = error as AxiosError<any>;
    throw new Error(err.response?.data?.error || "Không thể tải đánh giá");
  }
};

// Thêm hoặc chỉnh sửa đánh giá
export const addOrUpdateRating = async (itemID: number, contents: string) => {
  try {
    const res = await API.post(`/ratings`, { itemID, contents });
    return res.data;
  } catch (error) {
    const err = error as AxiosError<any>;
    throw new Error(err.response?.data?.error || "Đánh giá thất bại");
  }
};

// Xóa đánh giá theo ID của rating
export const deleteRating = async (ratingID: number) => {
  try {
    const res = await API.delete(`/ratings/${ratingID}`);
    return res.data;
  } catch (error) {
    const err = error as AxiosError<any>;
    throw new Error(err.response?.data?.error || "Xóa đánh giá thất bại");
  }
};