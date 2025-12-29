"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemService = void 0;
// src/services/item.service.ts
const item_db_1 = require("../db/item.db");
class ItemService {
    static async getAll() {
        return await item_db_1.ItemDB.getAllItemsDB();
    }
    static async create(data) {
        return await item_db_1.ItemDB.createItemDB(data);
    }
    static async update(id, data) {
        console.log(data);
        return await item_db_1.ItemDB.updateItemDB(id, data);
    }
    static async delete(id) {
        return await item_db_1.ItemDB.deleteItemDB(id);
    }
}
exports.ItemService = ItemService;
