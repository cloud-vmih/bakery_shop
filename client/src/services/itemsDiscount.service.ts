import API from "../api/axois.config";
import { AxiosError } from "axios";

export interface ItemsDiscount {
  itemId: number;
  title: string;
  dicountAmount: number;
  startAt?: string;
  endAt?: string;
}

export const getAllItemsDiscount = async (): Promise<ItemsDiscount[]> => {
  try {
    const res = await API.get("/items-discount");
    return res.data;
  } catch (error) {
    throw new Error("Không lấy được danh sách items discount");
  }
};

export const getItemsDiscount = async (id: number): Promise<ItemsDiscount> => {
  try {
    const res = await API.get(`/items-discount/${id}`);
    return res.data;
  } catch (error) {
    throw new Error("Không lấy được thông tin discount");
  }
};

export const createItemsDiscount = async (payload: ItemsDiscount) => {
  try {
    const res = await API.post("/items-discount", payload);
    return res.data;
  } catch (error) {
    const err = error as AxiosError<any>;
    throw new Error(err.response?.data?.message || "Tạo discount thất bại");
  }
};

export const updateItemsDiscount = async (id: number, payload: Partial<ItemsDiscount>) => {
  try {
    const res = await API.put(`/items-discount/${id}`, payload);
    return res.data;
  } catch (error) {
    throw new Error("Cập nhật thất bại");
  }
};

export const deleteItemsDiscount = async (id: number) => {
  try {
    const res = await API.delete(`/items-discount/${id}`);
    return res.data;
  } catch (error) {
    throw new Error("Xóa thất bại");
  }
};
