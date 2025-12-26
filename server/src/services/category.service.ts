import { ECategory } from "../entity/enum/enum";
import {
  findItemById,
  findItemsByCategory,
  findAllItems,
} from "../db/category.db";

export class CategoryService {
  async getAllItems() {
    return await findAllItems();
  }

  async getItemsByCategory(category: ECategory) {
    return await findItemsByCategory(category);
  }

  async getItemById(id: number) {
    return await findItemById(id);
  }
}
