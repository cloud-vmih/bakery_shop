// client/services/rating.service.ts
import API from "../api/axois.config";
import { AxiosError } from "axios";

export interface Rating {
  itemID: number;
  customerID: number;
  contents: string;
  createAt: string;
  customer?: {
    fullName: string;
    avatarURL?: string;
  };
}

/** Lấy tất cả rating của 1 item */
export const getRatingsByItem = async (itemID: number): Promise<Rating[]> => {
  try {
    const res = await API.get(`/ratings/item/${itemID}`);
    return res.data;
  } catch (error) {
    const err = error as AxiosError<any>;
    throw new Error(err.response?.data?.error || "Không thể tải đánh giá");
  }
};

/** Thêm hoặc cập nhật rating */
export const addOrUpdateRating = async (itemID: number, contents: string) => {
  try {
    const res = await API.post(`/ratings`, { itemID, contents });
    return res.data;
  } catch (error) {
    const err = error as AxiosError<any>;
    throw new Error(err.response?.data?.error || "Đánh giá thất bại");
  }
};

/** Xóa rating */
export const deleteRating = async (itemID: number) => {
  try {
    const res = await API.delete(`/ratings/${itemID}`);
    return res.data;
  } catch (error) {
    const err = error as AxiosError<any>;
    throw new Error(err.response?.data?.error || "Xóa đánh giá thất bại");
  }
};
