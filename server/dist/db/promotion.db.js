"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeItemsDiscountDB = exports.updateItemsDiscountDB = exports.createItemsDiscountDB = exports.findItemsDiscountById = exports.findAllItemsDiscount = void 0;
const database_1 = require("../config/database");
const ItemDiscount_1 = require("../entity/ItemDiscount");
const Item_1 = require("../entity/Item");
const repo = database_1.AppDataSource.getRepository(ItemDiscount_1.ItemsDiscount);
const itemRepo = database_1.AppDataSource.getRepository(Item_1.Item);
const findAllItemsDiscount = async () => {
    return await repo.find({
        relations: ["items"],
    });
};
exports.findAllItemsDiscount = findAllItemsDiscount;
const findItemsDiscountById = async (id) => {
    return await repo.findOne({
        where: { id },
        relations: ["items"],
    });
};
exports.findItemsDiscountById = findItemsDiscountById;
const createItemsDiscountDB = async (data) => {
    const items = await itemRepo.findByIds(data.itemIds);
    if (items.length !== data.itemIds.length)
        return null;
    const discount = repo.create({
        items,
        title: data.title,
        discountAmount: data.discountAmount,
        startAt: data.startAt,
        endAt: data.endAt,
    });
    return await repo.save(discount);
};
exports.createItemsDiscountDB = createItemsDiscountDB;
const typeorm_1 = require("typeorm");
const updateItemsDiscountDB = async (entity, newItemIds) => {
    if (newItemIds !== undefined) {
        const items = newItemIds.length
            ? await itemRepo.findBy({ id: (0, typeorm_1.In)(newItemIds) })
            : [];
        if (newItemIds.length && items.length !== newItemIds.length) {
            return null;
        }
        entity.items = items;
    }
    return await repo.save(entity);
};
exports.updateItemsDiscountDB = updateItemsDiscountDB;
const removeItemsDiscountDB = async (entity) => {
    await repo.remove(entity);
};
exports.removeItemsDiscountDB = removeItemsDiscountDB;
