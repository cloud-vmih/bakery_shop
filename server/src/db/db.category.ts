import { AppDataSource } from "../config/database";
import { Item } from "../entity/Item";
import { ECategory } from "../entity/enum/enum";

export const findAllItems = async () => {
  const repo = AppDataSource.getRepository(Item);
  return await repo.find();
};

export const findItemsByCategory = async (category: ECategory) => {
  const repo = AppDataSource.getRepository(Item);
  return await repo.find({ where: { category } });
};

export const findItemById = async (id: number) => {
  const repo = AppDataSource.getRepository(Item);
  return await repo.findOne({
    where: { id },
    relations: ["ratings", "wishlists", "inventory", "inventory.branch"],
  });
};
