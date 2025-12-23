import {
  createAddress,
  getAddressesByCustomer,
<<<<<<< HEAD
  updateAddress,
  deleteAddress,
  findAddressByPlaceId,
} from "../db/address.db";
import { AppDataSource } from "../config/database";
import { Customer } from "../entity/Customer";
import { User } from "../entity/User";
import { CreateAddressPayload } from "../db/address.db";

const customerRepo = AppDataSource.getRepository(Customer);
const userRepo = AppDataSource.getRepository(User);

export class AddressService {
  /* =======================
     GET LIST
  ======================= */
  async getAddressesByCustomer(customerId: number) {
    if (!customerId) {
      throw new Error("customerId không hợp lệ");
    }

    return getAddressesByCustomer(customerId);
  }

  /* =======================
     CREATE ADDRESS
  ======================= */
  async createAddress(customerId: number, payload: CreateAddressPayload) {
    if (!customerId) {
      throw new Error("customerId không hợp lệ");
    }

    const { fullAddress, lat, lng, placeId } = payload;

    if (!fullAddress || lat == null || lng == null) {
      throw new Error("Thiếu thông tin địa chỉ");
    }

    /* ===== 1. LẤY / UPGRADE CUSTOMER ===== */
    let customer = await customerRepo.findOne({
=======
  unsetDefaultAddress,
  updateAddress,
  CreateAddressPayload,
} from "../db/db.address";
import { AppDataSource } from "../config/database";
import { Customer } from "../entity/Customer";
import { User } from "../entity/User";
import { deleteAddress } from "../db/db.address"; 

const userRepo = AppDataSource.getRepository(User);

export async function getMyAddresses(customerId: number) {
  return getAddressesByCustomer(customerId);
}

export async function addAddress(
  customerId: number,
  payload: CreateAddressPayload
) {
  const customerRepo = AppDataSource.getRepository(Customer);
  const userRepo = AppDataSource.getRepository(User);

  // Bước 1: Thử tìm Customer trước
  let customer = await customerRepo.findOne({
    where: { id: customerId },
    relations: ["addresses"],
  });

  // Bước 2: Nếu không tìm thấy Customer → kiểm tra User và auto-upgrade
  if (!customer) {
    const user = await userRepo.findOne({ where: { id: customerId } });

    if (!user) {
      throw new Error("User không tồn tại");
    }

    // Upgrade type thành Customer
    await userRepo.update({ id: customerId }, { type: "Customer" });

    // Reload lại dưới dạng Customer (rất quan trọng!)
    customer = await customerRepo.findOne({
>>>>>>> feature/updateQuantity-v2
      where: { id: customerId },
      relations: ["addresses"],
    });

<<<<<<< HEAD
    if (!customer) {
      const user = await userRepo.findOne({ where: { id: customerId } });
      if (!user) {
        throw new Error("User không tồn tại");
      }

      // auto-upgrade user → customer
      await userRepo.update({ id: customerId }, { type: "Customer" });

      customer = await customerRepo.findOne({
        where: { id: customerId },
        relations: ["addresses"],
      });

      if (!customer) {
        throw new Error("Không thể upgrade user thành Customer");
      }
    }

    /* ===== 2. CHỐNG TRÙNG PLACE ID ===== */
    if (placeId) {
      const existed = await findAddressByPlaceId(customer.id!, placeId);
      if (existed) {
        return existed;
      }
    }

    /* ===== 3. CREATE (LOGIC DEFAULT Ở DB) ===== */
    return createAddress(customer, payload);
  }

  /* =======================
     UPDATE ADDRESS
  ======================= */
  async updateAddress(
    customerId: number,
    addressId: number,
    payload: Partial<CreateAddressPayload>
  ) {
    if (!customerId || !addressId) {
      throw new Error("Thiếu customerId hoặc addressId");
    }

    const updated = await updateAddress(addressId, customerId, payload);

    if (!updated) {
      throw new Error("Không tìm thấy địa chỉ để cập nhật");
    }

    return updated;
  }

  /* =======================
     SET DEFAULT ADDRESS
  ======================= */
  async setDefaultAddress(customerId: number, addressId: number) {
    return this.updateAddress(customerId, addressId, {
      isDefault: true,
    });
  }

  /* =======================
     DELETE ADDRESS
  ======================= */
  async deleteAddress(customerId: number, addressId: number) {
    if (!customerId || !addressId) {
      throw new Error("Thiếu customerId hoặc addressId");
    }

    const addresses = await getAddressesByCustomer(customerId);
    const addressToDelete = addresses.find((a) => a.id === addressId);

    if (!addressToDelete) {
      throw new Error("Địa chỉ không tồn tại");
    }

    await deleteAddress(addressId, customerId);

    // Nếu xóa default và còn địa chỉ khác → set cái đầu tiên làm default
    if (addressToDelete.isDefault && addresses.length > 1) {
      const remaining = addresses.filter((a) => a.id !== addressId);
      await updateAddress(remaining[0].id!, customerId, {
        isDefault: true,
      });
    }
  }
}
=======
    // Nếu vẫn null (hiếm xảy ra), ném lỗi rõ ràng
    if (!customer) {
      throw new Error("Không thể upgrade user thành Customer. Vui lòng kiểm tra lại entity.");
    }
  }

  // Bước 3: Từ đây trở đi, customer chắc chắn tồn tại và có addresses[]
  const hasAnyAddress = customer.addresses && customer.addresses.length > 0;

  const shouldBeDefault = !hasAnyAddress || payload.isDefault === true;

  if (shouldBeDefault) {
    await unsetDefaultAddress(customerId);
  }

  return createAddress(customer, {
    ...payload,
    isDefault: shouldBeDefault,
  });
}

export async function editAddress(
  customerId: number,
  addressId: number,
  payload: Partial<CreateAddressPayload>
) {
  // Nếu user muốn set default → unset cái cũ
  if (payload.isDefault === true) {
    await unsetDefaultAddress(customerId);
  }

  const updated = await updateAddress(addressId, customerId, payload);

  if (!updated) {
    throw new Error("Không tìm thấy địa chỉ để cập nhật");
  }

  return updated;
}

export async function setDefaultAddress(
  customerId: number,
  addressId: number
) {
  await unsetDefaultAddress(customerId);

  const updated = await updateAddress(addressId, customerId, {
    isDefault: true,
  });

  if (!updated) {
    throw new Error("Không tìm thấy địa chỉ");
  }

  return updated;
}

export async function removeAddress(customerId: number, addressId: number) {
  // Nếu địa chỉ đang là default, sau khi xóa thì cần chọn lại default (nếu còn địa chỉ khác)
  const addresses = await getAddressesByCustomer(customerId);
  const addressToDelete = addresses.find(a => a.id === addressId);

  if (!addressToDelete) {
    throw new Error("Địa chỉ không tồn tại");
  }

  // Xóa địa chỉ
  await deleteAddress(addressId, customerId);

  // Nếu địa chỉ bị xóa là default và còn địa chỉ khác → set cái đầu tiên làm default
  if (addressToDelete.isDefault && addresses.length > 1) {
    const remainingAddresses = addresses.filter(a => a.id !== addressId);
    const newDefault = remainingAddresses[0]; // Lấy cái đầu (theo order DESC)
    await updateAddress(newDefault.id!, customerId, { isDefault: true });
  }

  // Nếu chỉ còn 1 địa chỉ → nó sẽ tự thành default khi thêm/sửa sau (do rule hiện tại)
}
>>>>>>> feature/updateQuantity-v2
