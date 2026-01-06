"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeItemsDiscountController = exports.updateItemsDiscountController = exports.createItemsDiscountController = exports.getOneItemsDiscountController = exports.getAllItemsDiscountController = void 0;
const itemsDiscount_service_1 = require("../services/itemsDiscount.service");
const user_service_1 = require("../services/user.service");
const enum_1 = require("../entity/enum/enum");
const notification_service_1 = require("../services/notification.service");
const getAllItemsDiscountController = async (req, res) => {
    try {
        const data = await (0, itemsDiscount_service_1.getAllItemsDiscount)();
        console.log(data);
        return res.json(data);
    }
    catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getAllItemsDiscountController = getAllItemsDiscountController;
const getOneItemsDiscountController = async (req, res) => {
    try {
        const data = await (0, itemsDiscount_service_1.getOneItemsDiscount)(Number(req.params.id));
        return res.json(data);
    }
    catch (err) {
        if (err.message === "DISCOUNT_NOT_FOUND") {
            return res.status(404).json({ message: "Discount not found" });
        }
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getOneItemsDiscountController = getOneItemsDiscountController;
const createItemsDiscountController = async (req, res) => {
    try {
        const { itemIds } = req.body;
        if (!Array.isArray(itemIds) || itemIds.length === 0) {
            return res.status(400).json({ message: "Phải chọn ít nhất 1 sản phẩm" });
        }
        const data = await (0, itemsDiscount_service_1.createItemsDiscount)(req.body);
        const customerIds = await (0, user_service_1.getCustomerIds)();
        await (0, notification_service_1.sendNotification)(customerIds, data.title, "Khuyến mãi mới lên đến " + data.discountAmount + "%", enum_1.ENotiType.SYSTEM, `/menu`);
        return res.status(201).json(data);
    }
    catch (err) {
        if (err.message === "ITEMS_NOT_FOUND") {
            return res.status(400).json({ message: "Một số sản phẩm không tồn tại" });
        }
        if (err.message === "INVALID_DISCOUNT_AMOUNT" || err.message === "INVALID_DATE_RANGE") {
            return res.status(400).json({ message: err.message });
        }
        return res.status(500).json({ message: "Server error" });
    }
};
exports.createItemsDiscountController = createItemsDiscountController;
const updateItemsDiscountController = async (req, res) => {
    try {
        const { itemIds } = req.body;
        if (itemIds !== undefined && (!Array.isArray(itemIds) || itemIds.length === 0)) {
            return res.status(400).json({ message: "Phải chọn ít nhất 1 sản phẩm nếu cập nhật" });
        }
        const data = await (0, itemsDiscount_service_1.updateItemsDiscount)(Number(req.params.id), req.body);
        return res.json(data);
    }
    catch (err) {
        if (err.message === "DISCOUNT_NOT_FOUND") {
            return res.status(404).json({ message: "Discount not found" });
        }
        if (err.message === "ITEMS_NOT_FOUND" || err.message === "INVALID_DISCOUNT_AMOUNT" || err.message === "INVALID_DATE_RANGE") {
            return res.status(400).json({ message: err.message });
        }
        return res.status(500).json({ message: "Server error" });
    }
};
exports.updateItemsDiscountController = updateItemsDiscountController;
const removeItemsDiscountController = async (req, res) => {
    try {
        await (0, itemsDiscount_service_1.removeItemsDiscount)(Number(req.params.id));
        return res.json({ message: "Deleted successfully" });
    }
    catch (err) {
        if (err.message === "DISCOUNT_NOT_FOUND") {
            return res.status(404).json({ message: "Discount not found" });
        }
        return res.status(500).json({ message: "Server error" });
    }
};
exports.removeItemsDiscountController = removeItemsDiscountController;
