"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipDiscountDB = void 0;
const database_1 = require("../config/database");
const MembershipDiscount_1 = require("../entity/MembershipDiscount");
const repo = database_1.AppDataSource.getRepository(MembershipDiscount_1.MembershipDiscount);
exports.MembershipDiscountDB = {
    async findAll() {
        return repo.find({
            relations: ["items"],
            order: { createdAt: "DESC" },
        });
    },
    async findById(id) {
        return repo.findOne({
            where: { id },
            relations: ["items"],
        });
    },
    async create(data) {
        const discount = repo.create({
            title: data.title,
            discountAmount: data.discountAmount,
            minPoints: data.minPoints,
            startAt: data.startAt,
            endAt: data.endAt,
            isActive: data.isActive ?? true,
            items: data.itemIds
                ? data.itemIds.map(id => ({ id }))
                : [],
        });
        return repo.save(discount);
    },
    async update(id, data, itemIds) {
        const existed = await repo.findOne({
            where: { id },
            relations: ["items"],
        });
        if (!existed) {
            throw new Error("DISCOUNT_NOT_FOUND");
        }
        Object.assign(existed, data);
        if (itemIds !== undefined) {
            existed.items = itemIds.map(id => ({ id }));
        }
        return repo.save(existed);
    },
    async remove(id) {
        return repo.delete(id);
    },
};
