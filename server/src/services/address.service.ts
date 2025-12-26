import {
  createAddress,
  getAddressesByCustomer,
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
      where: { id: customerId },
      relations: ["addresses"],
    });

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
