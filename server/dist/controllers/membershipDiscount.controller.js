"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMembershipDiscount = exports.updateMembershipDiscount = exports.createMembershipDiscount = exports.getAllMembershipDiscounts = void 0;
const membershipDiscount_service_1 = require("../services/membershipDiscount.service");
const getAllMembershipDiscounts = async (req, res) => {
    try {
        const data = await membershipDiscount_service_1.MembershipDiscountService.getAll();
        return res.json(data);
    }
    catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getAllMembershipDiscounts = getAllMembershipDiscounts;
const createMembershipDiscount = async (req, res) => {
    try {
        const { itemIds } = req.body;
        if (itemIds !== undefined && (!Array.isArray(itemIds) || itemIds.length === 0)) {
            return res.status(400).json({ message: "Phải chọn ít nhất 1 sản phẩm nếu áp dụng cho sản phẩm cụ thể" });
        }
        const data = await membershipDiscount_service_1.MembershipDiscountService.create(req.body);
        return res.status(201).json(data);
    }
    catch (error) {
        switch (error.message) {
            case "INVALID_DISCOUNT_AMOUNT":
                return res.status(400).json({ message: "% giảm phải từ 0-100" });
            case "INVALID_DATE":
                return res.status(400).json({ message: "Ngày không hợp lệ" });
            case "ITEMS_NOT_FOUND":
                return res.status(400).json({ message: "Một số sản phẩm không tồn tại" });
            default:
                return res.status(500).json({ message: "Server error" });
        }
    }
};
exports.createMembershipDiscount = createMembershipDiscount;
const updateMembershipDiscount = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { itemIds } = req.body;
        if (itemIds !== undefined && (!Array.isArray(itemIds) || itemIds.length === 0)) { // ← THÊM: Validation nếu update itemIds
            return res.status(400).json({ message: "Phải chọn ít nhất 1 sản phẩm nếu áp dụng cho sản phẩm cụ thể" });
        }
        const data = await membershipDiscount_service_1.MembershipDiscountService.update(id, req.body);
        return res.json(data);
    }
    catch (error) {
        if (error.message === "DISCOUNT_NOT_FOUND") {
            return res.status(404).json({ message: "Không tìm thấy chương trình" });
        }
        if (error.message === "ITEMS_NOT_FOUND" || error.message === "INVALID_DISCOUNT_AMOUNT" || error.message === "INVALID_DATE") { // ← THÊM: ITEMS_NOT_FOUND và INVALID_DATE
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Server error" });
    }
};
exports.updateMembershipDiscount = updateMembershipDiscount;
const removeMembershipDiscount = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await membershipDiscount_service_1.MembershipDiscountService.remove(id);
        return res.json({ message: "Deleted successfully" });
    }
    catch (error) {
        if (error.message === "DISCOUNT_NOT_FOUND") {
            return res.status(404).json({ message: "Không tìm thấy chương trình" });
        }
        return res.status(500).json({ message: "Server error" });
    }
};
exports.removeMembershipDiscount = removeMembershipDiscount;
