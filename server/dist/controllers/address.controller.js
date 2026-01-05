"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyAddressesController = getMyAddressesController;
exports.createAddressController = createAddressController;
exports.updateAddressController = updateAddressController;
exports.setDefaultAddressController = setDefaultAddressController;
exports.deleteAddressController = deleteAddressController;
const address_service_1 = require("../services/address.service");
const addressService = new address_service_1.AddressService();
/**
 * GET /addresses
 * Lấy danh sách địa chỉ của user hiện tại
 */
async function getMyAddressesController(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const addresses = await addressService.getAddressesByCustomer(userId);
        return res.status(200).json({
            success: true,
            data: addresses,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Không thể lấy danh sách địa chỉ",
        });
    }
}
/**
 * POST /addresses
 * Thêm địa chỉ mới
 * - Dùng cho profile + checkout + google autocomplete
 */
async function createAddressController(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const address = await addressService.createAddress(userId, req.body);
        /**
         * Giữ response gọn cho FE checkout
         * (nếu muốn full object thì đổi sau)
         */
        return res.status(201).json({
            success: true,
            data: {
                id: address.id,
                fullAddress: address.fullAddress,
            },
            message: "Thêm địa chỉ thành công",
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Không thể thêm địa chỉ",
        });
    }
}
/**
 * PUT /addresses/:id
 * Cập nhật địa chỉ
 */
async function updateAddressController(req, res) {
    try {
        const userId = req.user?.id;
        const addressId = Number(req.params.id);
        if (!userId || !addressId) {
            return res.status(400).json({ message: "Thiếu thông tin" });
        }
        const address = await addressService.updateAddress(userId, addressId, req.body);
        return res.status(200).json({
            success: true,
            data: address,
            message: "Cập nhật địa chỉ thành công",
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Không thể cập nhật địa chỉ",
        });
    }
}
/**
 * PUT /addresses/:id/default
 * Đặt địa chỉ mặc định
 */
async function setDefaultAddressController(req, res) {
    try {
        const userId = req.user?.id;
        const addressId = Number(req.params.id);
        if (!userId || !addressId) {
            return res.status(400).json({ message: "Thiếu thông tin" });
        }
        const address = await addressService.setDefaultAddress(userId, addressId);
        return res.status(200).json({
            success: true,
            data: address,
            message: "Đã đặt địa chỉ mặc định",
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Không thể đặt địa chỉ mặc định",
        });
    }
}
/**
 * DELETE /addresses/:id
 * Xóa địa chỉ
 */
async function deleteAddressController(req, res) {
    try {
        const userId = req.user?.id;
        const addressId = Number(req.params.id);
        if (!userId || !addressId) {
            return res.status(400).json({ message: "Thiếu thông tin" });
        }
        await addressService.deleteAddress(userId, addressId);
        return res.status(200).json({
            success: true,
            message: "Xóa địa chỉ thành công",
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Không thể xóa địa chỉ",
        });
    }
}
