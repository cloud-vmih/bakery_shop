import { AppDataSource } from "../config/database";
import { Rating } from "../entity/Rating";
import { MoreThanOrEqual, ILike } from "typeorm";

export const ratingRepository = {
  async findById(id: number) {
    const repo = AppDataSource.getRepository(Rating);
    return await repo.findOne({ 
      where: { id },
      relations: ['item', 'customer', 'responses', 'responses.admin', 'responses.staff']
    });
  },

  async findFilteredRatings(filters: { productName?: string; dateFrom?: string; unhandled?: boolean }) {
    const repo = AppDataSource.getRepository(Rating);
    const where: any = {};

    if (filters.productName) {
      where.item = { name: ILike(`%${filters.productName}%`) };
    }
    if (filters.dateFrom) {
      where.createAt = MoreThanOrEqual(new Date(filters.dateFrom));
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

  async createOrUpdateRating(customerID: number, itemID: number, contents: string) {
    const repo = AppDataSource.getRepository(Rating);
    let rating = await repo.findOne({ where: { customer: { id: customerID }, item: { id: itemID } } });
    if (!rating) {
      rating = repo.create({ contents, customer: { id: customerID }, item: { id: itemID } });
    } else {
      rating.contents = contents;
    }
    return await repo.save(rating);
  },

  async getRatingsByItem(itemID: number) {
    const repo = AppDataSource.getRepository(Rating);
    return await repo.find({ where: { item: { id: itemID } }, relations: ['customer', 'responses'] });
  },

  async getRatingsByCustomer(customerID: number) {
    const repo = AppDataSource.getRepository(Rating);
    return await repo.find({ where: { customer: { id: customerID } }, relations: ['item', 'responses'] });
  },

  async deleteRating(customerID: number, itemID: number) {
    const repo = AppDataSource.getRepository(Rating);
    const rating = await repo.findOne({ where: { customer: { id: customerID }, item: { id: itemID } } });
    if (!rating) throw new Error('Rating không tồn tại');
    return await repo.remove(rating);
  },

  // Thêm để reviewService không bị lỗi
  async update(id: number, rating: Rating) {
    const repo = AppDataSource.getRepository(Rating);
    return await repo.save({ ...rating, id });
  },

  async delete(id: number) {
    const repo = AppDataSource.getRepository(Rating);
    const rating = await repo.findOne({ where: { id } });
    if (!rating) throw new Error('Rating không tồn tại');
    return await repo.remove(rating);
  },
};