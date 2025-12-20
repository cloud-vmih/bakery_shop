import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";
import { ECategory } from "../entity/enum/enum";

const service = new CategoryService();

export const getAllItems = async (req: Request, res: Response) => {
  try {
    const items = await service.getAllItems();
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching items" });
  }
};

export const getAllByCategory = async (req: Request, res: Response) => {
  try {
    const category = req.params.category.toUpperCase() as ECategory;

    if (!(category in ECategory)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const items = await service.getItemsByCategory(category);
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching category items" });
  }
};

export const getItemDetail = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const item = await service.getItemById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.json(item);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching item detail" });
  }
};
