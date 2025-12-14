// src/services/item.service.ts
import {
  getAllItemsDB,
  createItemDB,
  updateItemDB,
  deleteItemDB,
} from "../db/db.item";

export class ItemService {
  static async getAll() {
    return await getAllItemsDB();
  }

  static async create(data: any) {
    return await createItemDB(data);
  }

  static async update(id: number, data: any) {
    console.log(data);
    return await updateItemDB(id, data);
  }

  static async delete(id: number) {
    return await deleteItemDB(id);
  }
}