"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyAddressesController = getMyAddressesController;
exports.addAddressController = addAddressController;
exports.editAddressController = editAddressController;
exports.setDefaultAddressController = setDefaultAddressController;
const address_service_1 = require("../servies/address.service");
/**
 * GET /addresses
 * Lấy danh sách địa chỉ của customer hiện tại
 */
async function getMyAddressesController(req, res) {
    try {
        const userId = req.user.id;
        const addresses = await (0, address_service_1.getMyAddresses)(userId);
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
 */
async function addAddressController(req, res) {
    try {
        const userId = req.user.id;
        const payload = req.body;
        const address = await (0, address_service_1.addAddress)(userId, payload);
        return res.status(201).json({
            success: true,
            data: address,
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
 * Chỉnh sửa địa chỉ
 */
async function editAddressController(req, res) {
    try {
        const userId = req.user.id;
        const addressId = Number(req.params.id);
        const payload = req.body;
        const address = await (0, address_service_1.editAddress)(userId, addressId, payload);
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
 * Set địa chỉ mặc định
 */
async function setDefaultAddressController(req, res) {
    try {
        const userId = req.user.id;
        const addressId = Number(req.params.id);
        const address = await (0, address_service_1.setDefaultAddress)(userId, addressId);
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
