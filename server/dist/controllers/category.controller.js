"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItemDetail = exports.getAllByCategory = exports.getAllItems = void 0;
const category_service_1 = require("../services/category.service");
const enum_1 = require("../entity/enum/enum");
const service = new category_service_1.CategoryService();
const getAllItems = async (req, res) => {
    try {
        const items = await service.getAllItems();
        return res.json(items);
    }
    catch (error) {
        return res.status(500).json({ message: "Error fetching items" });
    }
};
exports.getAllItems = getAllItems;
const getAllByCategory = async (req, res) => {
    try {
        const category = req.params.category.toUpperCase();
        if (!(category in enum_1.ECategory)) {
            return res.status(400).json({ message: "Invalid category" });
        }
        const items = await service.getItemsByCategory(category);
        return res.json(items);
    }
    catch (error) {
        return res.status(500).json({ message: "Error fetching category items" });
    }
};
exports.getAllByCategory = getAllByCategory;
const getItemDetail = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const item = await service.getItemById(id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        return res.json(item);
    }
    catch (error) {
        console.error("Error fetching item detail:", error);
        return res.status(500).json({ message: "Error fetching item detail" });
    }
};
exports.getItemDetail = getItemDetail;
