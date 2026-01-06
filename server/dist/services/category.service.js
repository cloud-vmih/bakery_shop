"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const category_db_1 = require("../db/category.db");
class CategoryService {
    async getAllItems() {
        return await (0, category_db_1.findAllItems)();
    }
    async getItemsByCategory(category) {
        return await (0, category_db_1.findItemsByCategory)(category);
    }
    async getItemById(id) {
        return await (0, category_db_1.findItemById)(id);
    }
}
exports.CategoryService = CategoryService;
