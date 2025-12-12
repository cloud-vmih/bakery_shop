"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const db_category_1 = require("../db/db.category");
class CategoryService {
    async getAllItems() {
        return await (0, db_category_1.findAllItems)();
    }
    async getItemsByCategory(category) {
        return await (0, db_category_1.findItemsByCategory)(category);
    }
    async getItemById(id) {
        return await (0, db_category_1.findItemById)(id);
    }
}
exports.CategoryService = CategoryService;
