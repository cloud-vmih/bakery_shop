"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddressesByCustomer = getAddressesByCustomer;
exports.getDefaultAddress = getDefaultAddress;
exports.unsetDefaultAddress = unsetDefaultAddress;
exports.createAddress = createAddress;
exports.updateAddress = updateAddress;
const database_1 = require("../config/database");
const Address_1 = require("../entity/Address");
const addressRepository = database_1.AppDataSource.getRepository(Address_1.Address);
async function getAddressesByCustomer(customerId) {
    return addressRepository.find({
        where: { customer: { id: customerId } },
        order: {
            isDefault: "DESC", // default lên trước
            id: "DESC",
        },
    });
}
async function getDefaultAddress(customerId) {
    return addressRepository.findOne({
        where: {
            customer: { id: customerId },
            isDefault: true,
        },
    });
}
// Bỏ mặc định tất cả địa chỉ của customer
async function unsetDefaultAddress(customerId) {
    await addressRepository.update({ customer: { id: customerId }, isDefault: true }, { isDefault: false });
}
// Tạo địa chỉ mới
async function createAddress(customer, payload) {
    const address = addressRepository.create({
        ...payload,
        customer,
    });
    return addressRepository.save(address);
}
// Update địa chỉ
async function updateAddress(addressId, customerId, data) {
    const address = await addressRepository.findOne({
        where: {
            id: addressId,
            customer: { id: customerId },
        },
    });
    if (!address)
        return null;
    Object.assign(address, data);
    return addressRepository.save(address);
}
