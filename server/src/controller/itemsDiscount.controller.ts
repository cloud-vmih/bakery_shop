// src/controllers/itemsDiscount.controller.ts
import { Request, Response } from "express";
import {
  getAllItemsDiscount,
  getOneItemsDiscount,
  createItemsDiscount,
  updateItemsDiscount,
  removeItemsDiscount,
} from "../servies/itemsDiscount.service";

// =============================
// GET ALL
// =============================
export const getAllItemsDiscountController = async (req: Request, res: Response) => {
  try {
    const data = await getAllItemsDiscount();
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// =============================
// GET ONE
// =============================
export const getOneItemsDiscountController = async (req: Request, res: Response) => {
  try {
    const data = await getOneItemsDiscount(Number(req.params.id));
    return res.json(data);
  } catch (err: any) {
    if (err.message === "DISCOUNT_NOT_FOUND") {
      return res.status(404).json({ message: "Discount not found" });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

// =============================
// CREATE
// =============================
export const createItemsDiscountController = async (req: Request, res: Response) => {
  try {
    const data = await createItemsDiscount(req.body);
    return res.status(201).json(data);
  } catch (err: any) {
    if (err.message === "ITEM_NOT_FOUND") {
      return res.status(400).json({ message: "Item does not exist" });
    }
    if (err.message === "INVALID_DISCOUNT_AMOUNT" || err.message === "INVALID_DATE_RANGE") {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

// =============================
// UPDATE
// =============================
export const updateItemsDiscountController = async (req: Request, res: Response) => {
  try {
    const data = await updateItemsDiscount(Number(req.params.id), req.body);
    return res.json(data);
  } catch (err: any) {
    if (err.message === "DISCOUNT_NOT_FOUND") {
      return res.status(404).json({ message: "Discount not found" });
    }
    if (err.message === "INVALID_DISCOUNT_AMOUNT" || err.message === "INVALID_DATE_RANGE") {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

// =============================
// DELETE
// =============================
export const removeItemsDiscountController = async (req: Request, res: Response) => {
  try {
    await removeItemsDiscount(Number(req.params.id));
    return res.json({ message: "Deleted successfully" });
  } catch (err: any) {
    if (err.message === "DISCOUNT_NOT_FOUND") {
      return res.status(404).json({ message: "Discount not found" });
    }
    return res.status(500).json({ message: "Server error" });
  }
};
