"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratingRepository = void 0;
const database_1 = require("../config/database");
const Rating_1 = require("../entity/Rating");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("typeorm");
exports.ratingRepository = {
    async findById(id) {
        const ratingRepo = database_1.AppDataSource.getRepository(Rating_1.Rating);
        return await ratingRepo.findOne({ where: { id: id } });
    },
    async findFilteredRatings(filters) {
        const repo = database_1.AppDataSource.getRepository(Rating_1.Rating);
        const where = {};
        //console.log(filters.unhandled)
        if (filters.productName) {
            where.item = {
                name: (0, typeorm_2.ILike)(`%${filters.productName}%`)
            };
        }
        if (filters.dateFrom) {
            where.createAt = (0, typeorm_1.MoreThanOrEqual)(new Date(filters.dateFrom));
        }
        const reviews = await repo.find({
            where,
            relations: ['item', 'customer', 'responses', 'responses.admin', 'responses.staff'],
            order: { createAt: 'DESC' }, // Mới nhất → cũ nhất
        });
        if (filters.unhandled) {
            return reviews.filter(review => review.responses?.length === 0);
        }
        return reviews;
    },
    async update(id, rating) {
        const repo = database_1.AppDataSource.getRepository(Rating_1.Rating);
        return await repo.update(id, rating);
    },
    async delete(id) {
        const repo = database_1.AppDataSource.getRepository(Rating_1.Rating);
        return await repo.delete(id);
    },
};
