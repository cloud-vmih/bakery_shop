"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratingRepository = void 0;
const database_1 = require("../config/database");
const Rating_1 = require("../entity/Rating");
const typeorm_1 = require("typeorm");
exports.ratingRepository = {
    async findById(id) {
        const repo = database_1.AppDataSource.getRepository(Rating_1.Rating);
        return await repo.findOne({
            where: { id },
            relations: ['item', 'customer', 'responses', 'responses.admin', 'responses.staff']
        });
    },
    async findFilteredRatings(filters) {
        const repo = database_1.AppDataSource.getRepository(Rating_1.Rating);
        const where = {};
        if (filters.productName) {
            where.item = { name: (0, typeorm_1.ILike)(`%${filters.productName}%`) };
        }
        if (filters.dateFrom) {
            where.createAt = (0, typeorm_1.MoreThanOrEqual)(new Date(filters.dateFrom));
        }
        const reviews = await repo.find({
            where,
            relations: ['item', 'customer', 'responses', 'responses.admin', 'responses.staff'],
            order: { createAt: 'DESC' },
        });
        if (filters.unhandled) {
            return reviews.filter(review => review.responses?.length === 0);
        }
        return reviews;
    },
    async createOrUpdateRating(customerID, itemID, contents) {
        const repo = database_1.AppDataSource.getRepository(Rating_1.Rating);
        let rating = await repo.findOne({ where: { customer: { id: customerID }, item: { id: itemID } } });
        if (!rating) {
            rating = repo.create({ contents, customer: { id: customerID }, item: { id: itemID } });
        }
        else {
            rating.contents = contents;
        }
        return await repo.save(rating);
    },
    async getRatingsByItem(itemID) {
        const repo = database_1.AppDataSource.getRepository(Rating_1.Rating);
        return await repo.find({ where: { item: { id: itemID } }, relations: ['customer', 'responses'] });
    },
    async getRatingsByCustomer(customerID) {
        const repo = database_1.AppDataSource.getRepository(Rating_1.Rating);
        return await repo.find({ where: { customer: { id: customerID } }, relations: ['item', 'responses'] });
    },
    async deleteRating(customerID, itemID) {
        const repo = database_1.AppDataSource.getRepository(Rating_1.Rating);
        const rating = await repo.findOne({ where: { customer: { id: customerID }, item: { id: itemID } } });
        if (!rating)
            throw new Error('Rating không tồn tại');
        return await repo.remove(rating);
    },
    // Thêm để reviewService không bị lỗi
    async update(id, rating) {
        const repo = database_1.AppDataSource.getRepository(Rating_1.Rating);
        return await repo.save({ ...rating, id });
    },
    async delete(id) {
        const repo = database_1.AppDataSource.getRepository(Rating_1.Rating);
        const rating = await repo.findOne({ where: { id } });
        if (!rating)
            throw new Error('Rating không tồn tại');
        return await repo.remove(rating);
    },
};
