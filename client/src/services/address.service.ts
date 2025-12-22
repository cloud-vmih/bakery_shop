import API from "../api/axois.config";

export interface Address {
  id?: number;
  placeId: string;
  fullAddress: string;
  lat: number;
  lng: number;
  isDefault?: boolean;
}

export interface CreateAddressPayload {
  placeId: string;
  fullAddress: string;
  lat: number;
  lng: number;
  isDefault?: boolean;
}

// Lấy danh sách địa chỉ của user hiện tại
export const getMyAddresses = async (): Promise<Address[]> => {
  try {
    const response = await API.get("/address");
    if (!response.data.success) {
      throw new Error(response.data.message || "Lỗi lấy danh sách địa chỉ");
    }
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Không thể lấy danh sách địa chỉ"
    );
  }
};

// Thêm địa chỉ mới
export const addAddress = async (
  payload: CreateAddressPayload
): Promise<Address> => {
  try {
    const response = await API.post("/address", payload);
    if (!response.data.success) {
      throw new Error(response.data.message || "Lỗi thêm địa chỉ");
    }
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Không thể thêm địa chỉ");
  }
};

// Cập nhật địa chỉ
export const updateAddress = async (
  addressId: number,
  payload: Partial<CreateAddressPayload>
): Promise<Address> => {
  try {
    const response = await API.put(`/address/${addressId}`, payload);
    if (!response.data.success) {
      throw new Error(response.data.message || "Lỗi cập nhật địa chỉ");
    }
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Không thể cập nhật địa chỉ"
    );
  }
};

// Đặt địa chỉ làm mặc định
export const setDefaultAddress = async (
  addressId: number
): Promise<Address> => {
  try {
    const response = await API.put(`/address/${addressId}/default`);
    if (!response.data.success) {
      throw new Error(response.data.message || "Lỗi đặt địa chỉ mặc định");
    }
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Không thể đặt địa chỉ mặc định"
    );
  }
};

export const deleteAddress = async (addressId: number): Promise<void> => {
  try {
    const response = await API.delete(`/address/${addressId}`);
    if (!response.data.success) {
      throw new Error(response.data.message || "Lỗi xóa địa chỉ");
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Không thể xóa địa chỉ");
  }
};

