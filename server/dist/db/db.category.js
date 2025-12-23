"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findItemById = exports.findItemsByCategory = exports.findAllItems = void 0;
const database_1 = require("../config/database");
const Item_1 = require("../entity/Item");
const findAllItems = async () => {
    const repo = database_1.AppDataSource.getRepository(Item_1.Item);
    return await repo.find();
};
exports.findAllItems = findAllItems;
const findItemsByCategory = async (category) => {
    const repo = database_1.AppDataSource.getRepository(Item_1.Item);
    return await repo.find({ where: { category } });
};
exports.findItemsByCategory = findItemsByCategory;
const findItemById = async (id) => {
    const repo = database_1.AppDataSource.getRepository(Item_1.Item);
    return await repo.findOne({
        where: { id },
        relations: ["ratings", "wishlist"],
    });
};
exports.findItemById = findItemById;
