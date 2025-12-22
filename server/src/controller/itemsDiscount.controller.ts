// src/controllers/itemsDiscount.controller.ts
import { Request, Response } from "express";
import { ItemsDiscountService } from "../services/itemsDiscount.service";


// GET ALL
export const getAllItemsDiscount = async (req: Request, res: Response) => {
  try {
    const data = await ItemsDiscountService.getAll();
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: "Server error", err });
  }
};

// GET ONE
export const getOneItemsDiscount = async (req: Request, res: Response) => {
  try {
    const data = await ItemsDiscountService.getOne(Number(req.params.id));
    return res.json(data);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "NOT_FOUND") {
      return res.status(404).json({ message: "Not found" });
    }
    console.error("Error in getOne:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// CREATE
export const createItemsDiscount = async (req: Request, res: Response) => {
  try {
    const data = await ItemsDiscountService.create(req.body);
    return res.json(data);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "ITEM_NOT_FOUND") {
      return res.status(400).json({ message: "Item does not exist" });
    }
    console.error("Error in create:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// UPDATE
export const updateItemsDiscount = async (req: Request, res: Response) => {
  try {
    const data = await ItemsDiscountService.update(
      Number(req.params.id),
      req.body
    );
    return res.json(data);
  } catch (err) {
    const error = err as Error;

    if (error.message === "NOT_FOUND") {
      return res.status(404).json({ message: "Discount not found" });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE
export const removeItemsDiscount = async (req: Request, res: Response) => {
  try {
    await ItemsDiscountService.remove(Number(req.params.id));
    return res.json({ message: "Deleted successfully" });
  } catch (err) {
    const error = err as Error;

    if (error.message === "NOT_FOUND") {
      return res.status(404).json({ message: "Not found" });
    }
    return res.status(500).json({ message: "Server error" });
  }
};
