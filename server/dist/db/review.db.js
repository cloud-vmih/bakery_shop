"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRepository = void 0;
const typeorm_1 = require("typeorm");
const database_1 = require("../config/database");
const ResponseRating_1 = require("../entity/ResponseRating");
exports.reviewRepository = {
    async findReviews(filters) {
        const repo = database_1.AppDataSource.getRepository(ResponseRating_1.ResponseRating);
        const where = {};
        if (filters.productName) {
            where.item = { name: (0, typeorm_1.Like)(`%${filters.productName}%`) };
        }
        if (filters.dateFrom) {
            where.createdAt = (0, typeorm_1.MoreThanOrEqual)(new Date(filters.dateFrom));
        }
        if (filters.unhandled) {
            where.response = (0, typeorm_1.IsNull)();
        }
        const reviews = await repo.find({
            where,
            relations: ['item', 'customer', 'response'],
            order: { createAt: 'DESC' }, // Mới nhất → cũ nhất
        });
        return reviews;
    },
    async delete(ratingId) {
        const repo = database_1.AppDataSource.getRepository(ResponseRating_1.ResponseRating);
        return await repo.delete(ratingId);
    },
    async save(review) {
        const repo = database_1.AppDataSource.getRepository(ResponseRating_1.ResponseRating);
        return await repo.save(review);
    },
};
