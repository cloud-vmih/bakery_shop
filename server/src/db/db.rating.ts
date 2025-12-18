import { AppDataSource } from "../config/database";
import { Rating } from '../entity/Rating';
import { MoreThanOrEqual, IsNull } from 'typeorm';
import { ILike } from 'typeorm';


export const ratingRepository = {
    async findById(id: number) {
        const ratingRepo = AppDataSource.getRepository(Rating);
        return await ratingRepo.findOne({ where: { id: id }});
    },

    async findFilteredRatings(filters: { productName?: string; dateFrom?: string; unhandled?: boolean }) {
    const repo = AppDataSource.getRepository(Rating);
    const where: any = {};
    //console.log(filters.unhandled)


    if (filters.productName) {
        where.item = {
        name: ILike(`%${filters.productName}%`)
  };
    }
    if (filters.dateFrom) {
        where.createAt = MoreThanOrEqual(new Date(filters.dateFrom));
    }

    const reviews = await repo.find({
        where,
        relations: ['item', 'customer', 'responses'],
        order: { createAt: 'DESC' }, // Mới nhất → cũ nhất
    });

    if (filters.unhandled) {
        return reviews.filter(review => review.responses?.length === 0);
}

    return reviews;
    },

    async update(id:number, rating: Rating){
        const repo = AppDataSource.getRepository(Rating);
        return await repo.update(id, rating);
    },

    async delete(id: number ) {
        const repo = AppDataSource.getRepository(Rating);
        return await repo.delete(id);
    },
}