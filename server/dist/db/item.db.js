"use strict";
// src/repositories/ItemRepository.ts (hoặc giữ nguyên vị trí cũ)
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemDB = void 0;
const database_1 = require("../config/database");
const Item_1 = require("../entity/Item");
class ItemDB {
    // LẤY TẤT CẢ ITEMS
    static async getAllItemsDB() {
        return await this.repository.find();
    }
    // TẠO MỚI ITEM
    static async createItemDB(data) {
        const item = this.repository.create(data);
        return await this.repository.save(item);
    }
    // CẬP NHẬT ITEM
    static async updateItemDB(id, data) {
        const result = await this.repository.update(id, data);
        if (result.affected === 0) {
            throw new Error("Không tìm thấy món để cập nhật");
        }
        const updatedItem = await this.repository.findOne({
            where: { id },
        });
        if (!updatedItem) {
            throw new Error("Cập nhật thất bại – không tìm thấy món sau khi lưu");
        }
        return updatedItem;
    }
    // XÓA ITEM
    static async deleteItemDB(id) {
        const result = await this.repository.delete(id);
        if (result.affected === 0) {
            throw new Error("Không tìm thấy món để xóa");
        }
        return { message: "Xóa thành công" };
    }
}
exports.ItemDB = ItemDB;
ItemDB.repository = database_1.AppDataSource.getRepository(Item_1.Item);
