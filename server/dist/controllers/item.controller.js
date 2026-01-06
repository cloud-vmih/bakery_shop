"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemController = void 0;
const item_service_1 = require("../services/item.service");
exports.ItemController = {
    getAll: async (req, res) => {
        try {
            const items = await item_service_1.ItemService.getAll();
            res.status(200).json(items);
        }
        catch (error) {
            console.error("Lỗi getAll items:", error);
            res.status(500).json({ message: "Lỗi server khi lấy danh sách món" });
        }
    },
    create: async (req, res) => {
        try {
            const newItem = await item_service_1.ItemService.create(req.body);
            res.status(201).json({
                message: "Thêm món thành công!",
                data: newItem,
            });
        }
        catch (error) {
            console.error("Lỗi tạo món:", error);
            res.status(400).json({
                message: "Thêm món thất bại",
                error: error.message || "Dữ liệu không hợp lệ",
            });
        }
    },
    update: async (req, res) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "ID không hợp lệ" });
            }
            const updatedItem = await item_service_1.ItemService.update(id, req.body);
            if (!updatedItem) {
                return res.status(404).json({ message: "Không tìm thấy món để cập nhật" });
            }
            res.status(200).json({
                message: "Cập nhật món thành công!",
                data: updatedItem,
            });
        }
        catch (error) {
            console.error("Lỗi cập nhật món:", error);
            res.status(400).json({
                message: "Cập nhật thất bại",
                error: error.message,
            });
        }
    },
    // XÓA MÓN
    delete: async (req, res) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "ID không hợp lệ" });
            }
            const result = await item_service_1.ItemService.delete(id);
            if (!result) {
                return res.status(404).json({ message: "Không tìm thấy món để xóa" });
            }
            res.status(200).json({
                message: "Xóa món thành công!",
            });
        }
        catch (error) {
            console.error("Lỗi xóa món:", error);
            res.status(500).json({
                message: "Xóa thất bại",
                error: error.message,
            });
        }
    },
};
