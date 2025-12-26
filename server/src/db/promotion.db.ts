// src/db/promotion.db.ts
import { AppDataSource } from "../config/database";
import { ItemsDiscount } from "../entity/ItemDiscount";
import { Item } from "../entity/Item";

const repo = AppDataSource.getRepository(ItemsDiscount);
const itemRepo = AppDataSource.getRepository(Item);

export const findAllItemsDiscount = async () => {
  return await repo.find({
    relations: ["item"], // ✅ BẮT BUỘC
  });
};

export const findItemsDiscountById = async (id: number) => {
  return await repo.findOne({
    where: { id },
    relations: ["item"], // ✅ BẮT BUỘC
  });
};

export const createItemsDiscountDB = async (data: {
  itemId: number;
  title?: string;
  discountAmount: number;
  startAt: Date | null;
  endAt: Date | null;
}) => {
  const item = await itemRepo.findOne({ where: { id: data.itemId } });
  if (!item) return null;

  const discount = repo.create({
    item,
    title: data.title,
    discountAmount: data.discountAmount,
    startAt: data.startAt,
    endAt: data.endAt,
  });

  return await repo.save(discount);
};

export const updateItemsDiscountDB = async (entity: ItemsDiscount) => {
  return await repo.save(entity);
};

export const removeItemsDiscountDB = async (entity: ItemsDiscount) => {
  await repo.remove(entity);
};
