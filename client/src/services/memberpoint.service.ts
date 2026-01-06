// client/src/services/mempoint.service.ts
import toast from "react-hot-toast";
import API from "../api/axois.config";

export interface MembershipPointsResponse {
  totalPoints: number;
  history: Array<{
    id: number;
    orderAmount: number;
    earnedPoints: number;
    note: string;
    createdAt: string;
    orderId?: number;
  }>;
}

export const getMyPoints = async (): Promise<MembershipPointsResponse> => {
  try {
    const res = await API.get(`/membership/info`);
    return res.data;
  } catch (error) {
    toast.error("Không tải được thông tin điểm thành viên");
    throw new Error("Lấy thông tin thất bại");
  }
};

export const updatePoint = async (totalPoints: number) => {
  try {
    const res = await API.get(`/membership/:id/update`);
    return res.data;
  } catch (error) {
    toast.error("Không tải được thông tin điểm thành viên");
    throw new Error("Lấy thông tin thất bại");
  }
}
