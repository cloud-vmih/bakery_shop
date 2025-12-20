// services/menu.services.ts
import API from "../api/axois.config";
import { AxiosError } from "axios";

export const getMenu = async (): Promise<any> => {
  try {
    const res = await API.get("/category");
    return res.data;
  } catch (error) {
    const err = error as AxiosError<any>;
    throw new Error(
      err.response?.data?.error || "Không thể tải danh sách sản phẩm"
    );
  }
};
