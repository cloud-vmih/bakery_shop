"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipDiscountService = void 0;
const membershipDiscount_db_1 = require("../db/membershipDiscount.db");
const normalizeDate = (value) => {
    return value ? new Date(value) : undefined;
};
exports.MembershipDiscountService = {
    async getAll() {
        return membershipDiscount_db_1.MembershipDiscountDB.findAll();
    },
    async create(payload) {
        const { discountAmount, itemIds, startAt, endAt } = payload;
        if (discountAmount < 0 || discountAmount > 100) {
            throw new Error("INVALID_DISCOUNT_AMOUNT");
        }
        if (itemIds !== undefined && itemIds.length === 0) {
            throw new Error("ITEMS_NOT_FOUND");
        }
        if (startAt && endAt && new Date(endAt) <= new Date(startAt)) {
            throw new Error("INVALID_DATE");
        }
        return membershipDiscount_db_1.MembershipDiscountDB.create({
            title: payload.title,
            discountAmount: payload.discountAmount,
            minPoints: payload.minPoints,
            itemIds,
            startAt: normalizeDate(startAt),
            endAt: normalizeDate(endAt),
            isActive: payload.isActive ?? true,
        });
    },
    async update(id, payload) {
        const existed = await membershipDiscount_db_1.MembershipDiscountDB.findById(id);
        if (!existed) {
            throw new Error("DISCOUNT_NOT_FOUND");
        }
        if (payload.discountAmount !== undefined &&
            (payload.discountAmount < 0 || payload.discountAmount > 100)) {
            throw new Error("INVALID_DISCOUNT_AMOUNT");
        }
        if (payload.itemIds !== undefined && payload.itemIds.length === 0) {
            throw new Error("ITEMS_NOT_FOUND");
        }
        if (payload.startAt &&
            payload.endAt &&
            new Date(payload.endAt) <= new Date(payload.startAt)) {
            throw new Error("INVALID_DATE");
        }
        const dbPayload = {
            title: payload.title,
            discountAmount: payload.discountAmount,
            minPoints: payload.minPoints,
            startAt: normalizeDate(payload.startAt),
            endAt: normalizeDate(payload.endAt),
        };
        return membershipDiscount_db_1.MembershipDiscountDB.update(id, dbPayload, payload.itemIds);
    },
    async remove(id) {
        const existed = await membershipDiscount_db_1.MembershipDiscountDB.findById(id);
        if (!existed) {
            throw new Error("DISCOUNT_NOT_FOUND");
        }
        return membershipDiscount_db_1.MembershipDiscountDB.remove(id);
    },
};
