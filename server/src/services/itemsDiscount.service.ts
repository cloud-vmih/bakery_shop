// src/services/itemsDiscount.service.ts
import { AppDataSource } from "../config/database";
import { ItemsDiscount } from "../entity/ItemDiscount";
import { Item } from "../entity/Item";

export class ItemsDiscountService {
  private static repo = AppDataSource.getRepository(ItemsDiscount);
  private static itemRepo = AppDataSource.getRepository(Item);

  // ================================
  // GET ALL
  // ================================
  static async getAll() {
    return this.repo.find({ relations: ["item"] });
  }

  // ================================
  // GET ONE
  // ================================
  static async getOne(itemId: number) {
    const discount = await this.repo.findOne({
      where: { item: {id: itemId} },
      relations: ["item"],
    });

    if (!discount) throw new Error("NOT_FOUND");
    return discount;
  }

  // ================================
  // CREATE
  // ================================
  static async create(data: any) {
    const { itemId, title, discountAmount, startAt, endAt } = data;

    // check item exists
    const item = await this.itemRepo.findOne({ where: { id: itemId } });
    if (!item) throw new Error("ITEM_NOT_FOUND");

    const discount = this.repo.create({
      item,
      title,
      discountAmount,
      startAt: startAt ? new Date(startAt) : null,
      endAt: endAt ? new Date(endAt) : null,
    });

    return this.repo.save(discount);
  }

  // ================================
  // UPDATE
  // ================================
  static async update(itemId: number, data: any) {
    const discount = await this.repo.findOne({ where: {item: {id: itemId} }});
    if (!discount) throw new Error("NOT_FOUND");

    // CHỈ GÁN NHỮNG FIELD HỢP LỆ
    if (data.title !== undefined) discount.title = data.title;
    if (data.discountAmount !== undefined) discount.discountAmount = data.discountAmount;

    // startAt
    if (data.startAt === null) {
      discount.startAt = null;
    } else if (data.startAt) {
      discount.startAt = new Date(data.startAt);
    }

    // endAt
    if (data.endAt === null) {
      discount.endAt = null;
    } else if (data.endAt) {
      discount.endAt = new Date(data.endAt);
    }

    return this.repo.save(discount);
  }

  // ================================
  // DELETE
  // ================================
  static async remove(itemId: number) {
    const discount = await this.repo.findOne({ where: { item: {id: itemId} } });
    if (!discount) throw new Error("NOT_FOUND");

    return this.repo.remove(discount);
  }
}
