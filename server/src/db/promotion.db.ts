import { AppDataSource } from "../config/database";
import { ItemsDiscount } from "../entity/ItemDiscount";
import { Item } from "../entity/Item";

const repo = AppDataSource.getRepository(ItemsDiscount);
const itemRepo = AppDataSource.getRepository(Item);

export const findAllItemsDiscount = async () => {
  return await repo.find({
    relations: ["items"],
  });
};

export const findItemsDiscountById = async (id: number) => {
  return await repo.findOne({
    where: { id },
    relations: ["items"], 
  });
};

export const createItemsDiscountDB = async (data: {
  itemIds: number[];
  title?: string;
  discountAmount: number;
  startAt: Date | null;
  endAt: Date | null;
}) => {
  const items = await itemRepo.findByIds(data.itemIds);
  if (items.length !== data.itemIds.length) return null; 

  const discount = repo.create({
    items,
    title: data.title,
    discountAmount: data.discountAmount,
    startAt: data.startAt,
    endAt: data.endAt,
  });

  return await repo.save(discount);  
};

import { In } from "typeorm";

export const updateItemsDiscountDB = async (
  entity: ItemsDiscount,
  newItemIds?: number[]
) => {
  if (newItemIds !== undefined) {
    const items = newItemIds.length
      ? await itemRepo.findBy({ id: In(newItemIds) })
      : [];

    if (newItemIds.length && items.length !== newItemIds.length) {
      return null;
    }

    entity.items = items;
  }

  return await repo.save(entity);
};

export const removeItemsDiscountDB = async (entity: ItemsDiscount) => {
  await repo.remove(entity);
};