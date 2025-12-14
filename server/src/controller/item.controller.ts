// src/controllers/item.controller.ts
import { Request, Response } from "express";
import { ItemService } from "../services/item.service";

export const ItemController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const items = await ItemService.getAll();
      res.status(200).json(items);
    } catch (error: any) {
      console.error("Lỗi getAll items:", error);
      res.status(500).json({ message: "Lỗi server khi lấy danh sách món" });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const newItem = await ItemService.create(req.body);
      res.status(201).json({
        message: "Thêm món thành công!",
        data: newItem,
      });
    } catch (error: any) {
      console.error("Lỗi tạo món:", error);
      res.status(400).json({
        message: "Thêm món thất bại",
        error: error.message || "Dữ liệu không hợp lệ",
      });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID không hợp lệ" });
      }

      const updatedItem = await ItemService.update(id, req.body);

      if (!updatedItem) {
        return res.status(404).json({ message: "Không tìm thấy món để cập nhật" });
      }

      res.status(200).json({
        message: "Cập nhật món thành công!",
        data: updatedItem,
      });
    } catch (error: any) {
      console.error("Lỗi cập nhật món:", error);
      res.status(400).json({
        message: "Cập nhật thất bại",
        error: error.message,
      });
    }
  },

  // XÓA MÓN
  delete: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID không hợp lệ" });
      }

      const result = await ItemService.delete(id);

      if (!result) {
        return res.status(404).json({ message: "Không tìm thấy món để xóa" });
      }

      res.status(200).json({
        message: "Xóa món thành công!",
      });
    } catch (error: any) {
      console.error("Lỗi xóa món:", error);
      res.status(500).json({
        message: "Xóa thất bại",
        error: error.message,
      });
    }
  },
};