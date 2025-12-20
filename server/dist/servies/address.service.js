"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyAddresses = getMyAddresses;
exports.addAddress = addAddress;
exports.editAddress = editAddress;
exports.setDefaultAddress = setDefaultAddress;
const db_address_1 = require("../db/db.address");
const database_1 = require("../config/database");
const Customer_1 = require("../entity/Customer");
const User_1 = require("../entity/User");
async function getMyAddresses(customerId) {
    return (0, db_address_1.getAddressesByCustomer)(customerId);
}
async function addAddress(customerId, payload) {
    const customerRepo = database_1.AppDataSource.getRepository(Customer_1.Customer);
    const customer = await customerRepo.findOne({
        where: { id: customerId },
        relations: ["addresses"],
    });
    if (!customer) {
        // Debug: Kiểm tra xem user có tồn tại không (dù không phải Customer)
        const userRepo = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepo.findOne({ where: { id: customerId } });
        if (user) {
            throw new Error(`User tồn tại nhưng không phải Customer. Type hiện tại: ${user.type || 'undefined'}. Vui lòng đảm bảo user được tạo với Customer entity.`);
        }
        else {
            throw new Error(`Customer không tồn tại với id: ${customerId}`);
        }
    }
    const hasAnyAddress = customer.addresses && customer.addresses.length > 0;
    /**
     * Rule:
     * - Địa chỉ đầu tiên → auto default
     * - Từ địa chỉ thứ 2:
     *    + FE gửi isDefault = true → set default
     *    + FE không gửi / false → không default
     */
    const shouldBeDefault = !hasAnyAddress || payload.isDefault === true;
    if (shouldBeDefault) {
        await (0, db_address_1.unsetDefaultAddress)(customerId);
    }
    return (0, db_address_1.createAddress)(customer, {
        ...payload,
        isDefault: shouldBeDefault,
    });
}
async function editAddress(customerId, addressId, payload) {
    // Nếu user muốn set default → unset cái cũ
    if (payload.isDefault === true) {
        await (0, db_address_1.unsetDefaultAddress)(customerId);
    }
    const updated = await (0, db_address_1.updateAddress)(addressId, customerId, payload);
    if (!updated) {
        throw new Error("Không tìm thấy địa chỉ để cập nhật");
    }
    return updated;
}
async function setDefaultAddress(customerId, addressId) {
    await (0, db_address_1.unsetDefaultAddress)(customerId);
    const updated = await (0, db_address_1.updateAddress)(addressId, customerId, {
        isDefault: true,
    });
    if (!updated) {
        throw new Error("Không tìm thấy địa chỉ");
    }
    return updated;
}
