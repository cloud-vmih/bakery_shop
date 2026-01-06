import API from "../api/axois.config";

/* =======================
   TYPES
======================= */
export interface Address {
  id: number;
  placeId?: string;
  fullAddress: string;
  lat: number;
  lng: number;
  isDefault?: boolean;
}

export interface CreateAddressPayload {
  fullAddress: string;
  lat: number;
  lng: number;
  placeId?: string;
  isDefault?: boolean;
}

/* =======================
   GET: danh sách địa chỉ
   - Dùng cho profile + checkout
======================= */
export const getMyAddresses = async (): Promise<Address[]> => {
  try {
    // backend hỗ trợ cả /addresses và /addresses/my
    const res = await API.get("/addresses");
    console.log("ADDRESS API:", res.data);
    return res.data.data ?? res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Không thể lấy danh sách địa chỉ"
    );
  }
};

/* =======================
   CREATE: địa chỉ mới
   - Dùng cho checkout (Google autocomplete)
   - Trả về address vừa tạo
======================= */

export const createAddress = async (
  // cùng logic, khác tên với addAddress của tructruc
  payload: CreateAddressPayload
): Promise<Address> => {
  try {
    const res = await API.post("/addresses", payload);
    return res.data.data ?? res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Không thể thêm địa chỉ");
  }
};

/* =======================
   CREATE (CHECKOUT HELPER)
   - Giữ cho FE checkout của bạn
   - Trả về gọn: addressId + fullAddress
======================= */
export const createAddressForCheckout = async (
  payload: CreateAddressPayload
): Promise<{ addressId: number; fullAddress: string }> => {
  const address = await createAddress(payload);
  return {
    addressId: address.id,
    fullAddress: address.fullAddress,
  };
};

/* =======================
   UPDATE: chỉnh sửa địa chỉ
======================= */
export const updateAddress = async (
  addressId: number,
  payload: Partial<CreateAddressPayload>
): Promise<Address> => {
  try {
    const res = await API.put(`/addresses/${addressId}`, payload);
    return res.data.data ?? res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Không thể cập nhật địa chỉ"
    );
  }
};

/* =======================
   SET DEFAULT
======================= */
export const setDefaultAddress = async (
  addressId: number
): Promise<Address> => {
  try {
    const res = await API.put(`/addresses/${addressId}/default`);
    return res.data.data ?? res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Không thể đặt địa chỉ mặc định"
    );
  }
};

/* =======================
   DELETE
======================= */
export const deleteAddress = async (addressId: number): Promise<void> => {
  try {
    await API.delete(`/addresses/${addressId}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Không thể xóa địa chỉ");
  }
};
