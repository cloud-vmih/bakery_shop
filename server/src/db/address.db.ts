import { AppDataSource } from "../config/database";
import { Address } from "../entity/Address";
import { Customer } from "../entity/Customer";

const addressRepository = AppDataSource.getRepository(Address);

export interface CreateAddressPayload {
  placeId: string;
  fullAddress: string;
  lat: number;
  lng: number;
  isDefault?: boolean;
}

export async function getAddressesByCustomer(
  customerId: number
): Promise<Address[]> {
  return addressRepository.find({
    where: { customer: { id: customerId } },
    order: {
      isDefault: "DESC", // default lên trước
      id: "DESC",
    },
  });
}

export async function getDefaultAddress(
  customerId: number
): Promise<Address | null> {
  return addressRepository.findOne({
    where: {
      customer: { id: customerId },
      isDefault: true,
    },
  });
}

// Bỏ mặc định tất cả địa chỉ của customer
export async function unsetDefaultAddress(customerId: number): Promise<void> {
  await addressRepository.update(
    { customer: { id: customerId }, isDefault: true },
    { isDefault: false }
  );
}

// Tạo địa chỉ mới
export async function createAddress(
  customer: Customer,
  payload: CreateAddressPayload
): Promise<Address> {
  const address = addressRepository.create({
    ...payload,
    customer,
  });

  return addressRepository.save(address);
}

// Update địa chỉ
export async function updateAddress(
  addressId: number,
  customerId: number,
  data: Partial<CreateAddressPayload>
): Promise<Address | null> {
  const address = await addressRepository.findOne({
    where: {
      id: addressId,
      customer: { id: customerId },
    },
  });

  if (!address) return null;

  Object.assign(address, data);
  return addressRepository.save(address);
}

export async function deleteAddress(addressId: number, customerId: number): Promise<void> {
  const result = await addressRepository.delete({
    id: addressId,
    customer: { id: customerId },
  });

  if (result.affected === 0) {
    throw new Error("Không tìm thấy địa chỉ hoặc bạn không có quyền xóa");
  }
}
