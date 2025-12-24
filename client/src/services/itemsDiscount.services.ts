import API from "../api/axois.config";
import { AxiosError } from "axios";

export interface ItemsDiscount {
  id: number;
  itemId: number;
  title?: string;
  discountAmount: number;
  startAt?: string;
  endAt?: string;
}

// 👇 Dùng cho CREATE / UPDATE
export type ItemsDiscountPayload = Omit<ItemsDiscount, "id">;



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

export const createItemsDiscount = async (
  payload: ItemsDiscountPayload
): Promise<ItemsDiscount> => {
  const res = await API.post("/items-discount", payload);
  return res.data;
};

export const updateItemsDiscount = async (
  id: number,
  payload: ItemsDiscountPayload
): Promise<ItemsDiscount> => {
  const res = await API.put(`/items-discount/${id}`, payload);
  return res.data;
};


export const deleteItemsDiscount = async (id: number) => {
  try {
    const res = await API.delete(`/items-discount/${id}`);
    return res.data;
  } catch (error) {
    throw new Error("Xóa thất bại");
  }
};
