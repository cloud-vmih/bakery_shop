import API from "../api/axois.config";
import { AxiosError } from "axios";

/**
 * ======================
 * TYPES
 * ======================
 */

export interface MembershipDiscount {
  id: number;
  code: string;
  title: string;
  discountAmount: number; // % giảm (0-100)
  minPoints: number;
  startAt?: string;
  endAt?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Payload dùng cho CREATE
export type CreateMembershipDiscountPayload = Omit<
  MembershipDiscount,
  "id" | "createdAt" | "updatedAt"
>;

// Payload dùng cho UPDATE
export type UpdateMembershipDiscountPayload =
  Partial<CreateMembershipDiscountPayload>;

// Error response từ backend
interface ApiErrorResponse {
  message: string;
}

/**
 * ======================
 * API FUNCTIONS
 * ======================
 */

// Lấy danh sách chương trình thành viên
export const getAllMembershipDiscounts = async (): Promise<
  MembershipDiscount[]
> => {
  try {
    const res = await API.get("/promotion/member-discounts");
    return res.data;
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      err.response?.data?.message ||
        "Không lấy được danh sách chương trình thành viên"
    );
  }
};

// Tạo chương trình thành viên
export const createMembershipDiscount = async (
  payload: CreateMembershipDiscountPayload
): Promise<MembershipDiscount> => {
  try {
    const res = await API.post("/promotion/member-discounts", payload);
    return res.data;
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      err.response?.data?.message ||
        "Tạo chương trình thành viên thất bại"
    );
  }
};

// Cập nhật chương trình thành viên
export const updateMembershipDiscount = async (
  id: number,
  payload: UpdateMembershipDiscountPayload
): Promise<MembershipDiscount> => {
  try {
    const res = await API.put(`/promotion/member-discounts/${id}`, payload);
    return res.data;
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      err.response?.data?.message ||
        "Cập nhật chương trình thành viên thất bại"
    );
  }
};

// Xóa chương trình thành viên
export const deleteMembershipDiscount = async (id: number): Promise<void> => {
  try {
    await API.delete(`/promotion/member-discounts/${id}`);
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      err.response?.data?.message ||
        "Xóa chương trình thành viên thất bại"
    );
  }
};
