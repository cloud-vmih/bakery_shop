"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeItemsDiscount = exports.updateItemsDiscount = exports.createItemsDiscount = exports.getOneItemsDiscount = exports.getAllItemsDiscount = void 0;
const promotion_db_1 = require("../db/promotion.db");
const validateDiscount = (data) => {
    if (data.discountAmount !== undefined) {
        if (data.discountAmount < 0 || data.discountAmount > 100) {
            throw new Error("INVALID_DISCOUNT_AMOUNT");
        }
    }
    if (data.itemIds !== undefined && (!Array.isArray(data.itemIds) || data.itemIds.length === 0)) {
        throw new Error("ITEMS_NOT_FOUND");
    }
    if (data.startAt && data.endAt) {
        if (new Date(data.endAt) <= new Date(data.startAt)) {
            throw new Error("INVALID_DATE_RANGE");
        }
    }
};
const toDto = (entity) => ({
    id: entity.id,
    itemIds: entity.items ? entity.items.map(i => i.id).filter((id) => id !== undefined) : [],
    title: entity.title ?? undefined,
    discountAmount: entity.discountAmount ?? undefined,
    startAt: entity.startAt ? entity.startAt.toISOString() : undefined,
    endAt: entity.endAt ? entity.endAt.toISOString() : undefined,
});
const getAllItemsDiscount = async () => {
    const entities = await (0, promotion_db_1.findAllItemsDiscount)();
    return entities.map(toDto);
};
exports.getAllItemsDiscount = getAllItemsDiscount;
const getOneItemsDiscount = async (id) => {
    const entity = await (0, promotion_db_1.findItemsDiscountById)(id);
    if (!entity)
        throw new Error("DISCOUNT_NOT_FOUND");
    return toDto(entity);
};
exports.getOneItemsDiscount = getOneItemsDiscount;
const createItemsDiscount = async (data) => {
    validateDiscount(data);
    const saved = await (0, promotion_db_1.createItemsDiscountDB)({
        itemIds: data.itemIds,
        title: data.title,
        discountAmount: data.discountAmount,
        startAt: data.startAt ? new Date(data.startAt) : null,
        endAt: data.endAt ? new Date(data.endAt) : null,
    });
    if (!saved)
        throw new Error("ITEMS_NOT_FOUND");
    return toDto(saved);
};
exports.createItemsDiscount = createItemsDiscount;
const updateItemsDiscount = async (id, data) => {
    validateDiscount(data);
    const entity = await (0, promotion_db_1.findItemsDiscountById)(id);
    if (!entity)
        throw new Error("DISCOUNT_NOT_FOUND");
    if (data.title !== undefined)
        entity.title = data.title;
    if (data.discountAmount !== undefined)
        entity.discountAmount = data.discountAmount;
    if (data.startAt !== undefined)
        entity.startAt = data.startAt ? new Date(data.startAt) : null;
    if (data.endAt !== undefined)
        entity.endAt = data.endAt ? new Date(data.endAt) : null;
    const updated = await (0, promotion_db_1.updateItemsDiscountDB)(entity, data.itemIds);
    if (!updated)
        throw new Error("UPDATE_FAILED");
    return toDto(updated);
};
exports.updateItemsDiscount = updateItemsDiscount;
const removeItemsDiscount = async (id) => {
    const entity = await (0, promotion_db_1.findItemsDiscountById)(id);
    if (!entity)
        throw new Error("DISCOUNT_NOT_FOUND");
    await (0, promotion_db_1.removeItemsDiscountDB)(entity);
};
exports.removeItemsDiscount = removeItemsDiscount;
