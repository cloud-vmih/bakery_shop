// src/repositories/ItemRepository.ts (hoặc giữ nguyên vị trí cũ)

import { AppDataSource } from "../config/database";
import { Item } from "../entity/Item";

export class ItemDB {
  private static repository = AppDataSource.getRepository(Item);

  // LẤY TẤT CẢ ITEMS
  static async getAllItemsDB() {
    return await this.repository.find();
  }

  // TẠO MỚI ITEM
  static async createItemDB(data: Partial<Item>) {
    const item = this.repository.create(data);
    return await this.repository.save(item);
  }

  // CẬP NHẬT ITEM
  static async updateItemDB(id: number, data: Partial<Item>) {
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
  static async deleteItemDB(id: number) {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new Error("Không tìm thấy món để xóa");
    }
    return { message: "Xóa thành công" };
  }
}

