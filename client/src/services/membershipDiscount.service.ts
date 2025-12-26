import API from "../api/axois.config";
import { AxiosError } from "axios";
export interface MembershipDiscount {
  id: number;
  // code: string;  // ← XÓA: Bỏ code hoàn toàn
  title: string;
  discountAmount: number;
  minPoints: number;
  itemId?: number;  // ← THÊM: Optional, undefined = áp dụng toàn bộ menu
  startAt?: string;
  endAt?: string;
  isActive: boolean;
}

// Nếu có MembershipDiscountPayload, cũng thêm itemId?: number; vào đó
export interface MembershipDiscountPayload {
  // code: string;  // ← XÓA: Bỏ code hoàn toàn
  title: string;
  discountAmount: number;
  minPoints: number;
  itemId?: number;  // ← THÊM optional
  startAt?: string;
  endAt?: string;
  isActive: boolean;
}
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