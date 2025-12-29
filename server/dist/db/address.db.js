"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddressesByCustomer = getAddressesByCustomer;
exports.getDefaultAddress = getDefaultAddress;
exports.unsetDefaultAddress = unsetDefaultAddress;
exports.createAddress = createAddress;
exports.updateAddress = updateAddress;
exports.deleteAddress = deleteAddress;
exports.findAddressByPlaceId = findAddressByPlaceId;
const database_1 = require("../config/database");
const Address_1 = require("../entity/Address");
const addressRepository = database_1.AppDataSource.getRepository(Address_1.Address);
/* =======================
   FIND ADDRESSES (GOM LẠI 1)
======================= */
async function getAddressesByCustomer(customerId) {
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
async function getDefaultAddress(customerId) {
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
async function unsetDefaultAddress(customerId) {
    await addressRepository.update({ customer: { id: customerId }, isDefault: true }, { isDefault: false });
}
/* =======================
   CREATE ADDRESS (GOM LOGIC FILE 2)
======================= */
async function createAddress(customer, payload) {
    // 🔥 LOGIC BỔ SUNG: đảm bảo chỉ 1 default
    if (payload.isDefault === true) {
        await unsetDefaultAddress(customer.id);
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
async function updateAddress(addressId, customerId, data) {
    const address = await addressRepository.findOne({
        where: {
            id: addressId,
            customer: { id: customerId },
        },
    });
    if (!address)
        return null;
    // 🔥 nếu đổi sang default → unset cái cũ
    if (data.isDefault === true) {
        await unsetDefaultAddress(customerId);
    }
    Object.assign(address, {
        ...data,
        isDefault: data.isDefault !== undefined ? data.isDefault : address.isDefault,
    });
    return addressRepository.save(address);
}
/* =======================
   DELETE ADDRESS
======================= */
async function deleteAddress(addressId, customerId) {
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
async function findAddressByPlaceId(customerId, placeId) {
    return addressRepository.findOne({
        where: {
            customer: { id: customerId },
            placeId,
        },
    });
}
