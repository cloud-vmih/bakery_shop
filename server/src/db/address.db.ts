import { AppDataSource } from "../config/database";
import { Address } from "../entity/Address";
import { Customer } from "../entity/Customer";

const addressRepository = AppDataSource.getRepository(Address);

/* =======================
   PAYLOAD (GIỮ NGUYÊN)
======================= */
export interface CreateAddressPayload {
  placeId: string;
  fullAddress: string;
  lat: number;
  lng: number;
  isDefault?: boolean;
}

/* =======================
   FIND ADDRESSES (GOM LẠI 1)
======================= */
export async function getAddressesByCustomer(
  customerId: number
): Promise<Address[]> {
  return addressRepository.find({
    where: { customer: { id: customerId } },
    order: {
      isDefault: "DESC",
      id: "DESC",
    },
  });
}

/* =======================
   GET DEFAULT
======================= */
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

/* =======================
   UNSET DEFAULT
======================= */
export async function unsetDefaultAddress(customerId: number): Promise<void> {
  await addressRepository.update(
    { customer: { id: customerId }, isDefault: true },
    { isDefault: false }
  );
}

/* =======================
   CREATE ADDRESS (GOM LOGIC FILE 2)
======================= */
export async function createAddress(
  customer: Customer,
  payload: CreateAddressPayload
): Promise<Address> {
  // 🔥 LOGIC BỔ SUNG: đảm bảo chỉ 1 default
  if (payload.isDefault === true) {
    await unsetDefaultAddress(customer.id!);
  }

  const address = addressRepository.create({
    placeId: payload.placeId,
    fullAddress: payload.fullAddress,
    lat: payload.lat,
    lng: payload.lng,
    isDefault: payload.isDefault ?? false,
    customer,
  });

  return addressRepository.save(address);
}

/* =======================
   UPDATE ADDRESS
======================= */
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

  // 🔥 nếu đổi sang default → unset cái cũ
  if (data.isDefault === true) {
    await unsetDefaultAddress(customerId);
  }

  Object.assign(address, {
    ...data,
    isDefault:
      data.isDefault !== undefined ? data.isDefault : address.isDefault,
  });

  return addressRepository.save(address);
}

/* =======================
   DELETE ADDRESS
======================= */
export async function deleteAddress(
  addressId: number,
  customerId: number
): Promise<void> {
  const result = await addressRepository.delete({
    id: addressId,
    customer: { id: customerId },
  });

  if (result.affected === 0) {
    throw new Error("Không tìm thấy địa chỉ hoặc bạn không có quyền xóa");
  }
}

/* =======================
   FIND BY PLACE ID (THÊM TỪ FILE 2)
======================= */
export async function findAddressByPlaceId(
  customerId: number,
  placeId: string
): Promise<Address | null> {
  return addressRepository.findOne({
    where: {
      customer: { id: customerId },
      placeId,
    },
  });
}
