// src/services/item.service.ts
import {
 ItemDB
} from "../db/item.db";

export class ItemService {
  static async getAll() {
    return await ItemDB.getAllItemsDB();
  }

  static async create(data: any) {
    return await ItemDB.createItemDB(data);
  }

  static async update(id: number, data: any) {
    console.log(data);
    return await ItemDB.updateItemDB(id, data);
  }

  static async delete(id: number) {
    return await ItemDB.deleteItemDB(id);
  }
}