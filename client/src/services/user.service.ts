import API  from "../api/axois.config";
//import { UserResponse, UpdateUserPayload } from '../types/user'; // Import types khớp backend

export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  avatar: string | null;
}

// Interface cho updates (tùy chọn, chỉ update fields có giá trị, khớp với entity)
export interface UpdateUserPayload {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  avatar?: string;
}

// Lấy profile (GET /)
export const getProfile = async (): Promise<UserResponse> => {
  try {
    const response = await API.get('/profile');
    if (!response.data.success) {
      throw new Error(response.data.message || 'Lỗi lấy thông tin hồ sơ');
    }
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Không thể lấy hồ sơ');
  }
};

// Cập nhật profile (PUT /profile)
export const updateProfile = async (updates: UpdateUserPayload): Promise<UserResponse> => {
  try {
    if (Object.keys(updates).length === 0) {
      throw new Error('Không có thay đổi nào để cập nhật');
    }
    const response = await API.put('/update', updates);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Lỗi cập nhật hồ sơ');
    }
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Không thể cập nhật hồ sơ');
  }
};