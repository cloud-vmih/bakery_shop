"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressService = void 0;
const address_db_1 = require("../db/address.db");
const database_1 = require("../config/database");
const Customer_1 = require("../entity/Customer");
const User_1 = require("../entity/User");
const customerRepo = database_1.AppDataSource.getRepository(Customer_1.Customer);
const userRepo = database_1.AppDataSource.getRepository(User_1.User);
class AddressService {
    /* =======================
       GET LIST
    ======================= */
    async getAddressesByCustomer(customerId) {
        if (!customerId) {
            throw new Error("customerId không hợp lệ");
        }
        return (0, address_db_1.getAddressesByCustomer)(customerId);
    }
    /* =======================
       CREATE ADDRESS
    ======================= */
    async createAddress(customerId, payload) {
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
            const existed = await (0, address_db_1.findAddressByPlaceId)(customer.id, placeId);
            if (existed) {
                return existed;
            }
        }
        /* ===== 3. CREATE (LOGIC DEFAULT Ở DB) ===== */
        return (0, address_db_1.createAddress)(customer, payload);
    }
    /* =======================
       UPDATE ADDRESS
    ======================= */
    async updateAddress(customerId, addressId, payload) {
        if (!customerId || !addressId) {
            throw new Error("Thiếu customerId hoặc addressId");
        }
        const updated = await (0, address_db_1.updateAddress)(addressId, customerId, payload);
        if (!updated) {
            throw new Error("Không tìm thấy địa chỉ để cập nhật");
        }
        return updated;
    }
    /* =======================
       SET DEFAULT ADDRESS
    ======================= */
    async setDefaultAddress(customerId, addressId) {
        return this.updateAddress(customerId, addressId, {
            isDefault: true,
        });
    }
    /* =======================
       DELETE ADDRESS
    ======================= */
    async deleteAddress(customerId, addressId) {
        if (!customerId || !addressId) {
            throw new Error("Thiếu customerId hoặc addressId");
        }
        const addresses = await (0, address_db_1.getAddressesByCustomer)(customerId);
        const addressToDelete = addresses.find((a) => a.id === addressId);
        if (!addressToDelete) {
            throw new Error("Địa chỉ không tồn tại");
        }
        await (0, address_db_1.deleteAddress)(addressId, customerId);
        // Nếu xóa default và còn địa chỉ khác → set cái đầu tiên làm default
        if (addressToDelete.isDefault && addresses.length > 1) {
            const remaining = addresses.filter((a) => a.id !== addressId);
            await (0, address_db_1.updateAddress)(remaining[0].id, customerId, {
                isDefault: true,
            });
        }
    }
}
exports.AddressService = AddressService;
