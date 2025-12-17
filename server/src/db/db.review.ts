import { MoreThanOrEqual, IsNull } from 'typeorm';
import { AppDataSource } from "../config/database";
import { ResponseRating } from '../entity/ResponseRating';

export const reviewRepository = {
  async findReviews(filters: { productId?: string; dateFrom?: string; unhandled?: boolean }) {
    const repo = AppDataSource.getRepository(ResponseRating);
    const where: any = {};

    if (filters.productId) {
      where.item = { id: parseInt(filters.productId) };
    }
    if (filters.dateFrom) {
      where.createdAt = MoreThanOrEqual(new Date(filters.dateFrom));
    }
    if (filters.unhandled) {
      where.response = IsNull();
    }
    const reviews = await repo.find({
      where,
      relations: ['item', 'customer', 'response'],
      order: { createAt: 'DESC' }, // Mới nhất → cũ nhất
    });

    return reviews;
  },

  async delete(ratingId: number) {
    const repo = AppDataSource.getRepository(ResponseRating);
    return await repo.delete(ratingId);
  },

  async save(review: ResponseRating){
    const repo = AppDataSource.getRepository(ResponseRating);
    return await repo.save(review);
  },
};