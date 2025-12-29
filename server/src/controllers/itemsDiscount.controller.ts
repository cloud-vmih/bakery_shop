import { Request, Response } from "express";
import {
  getAllItemsDiscount,
  getOneItemsDiscount,
  createItemsDiscount,
  updateItemsDiscount,
  removeItemsDiscount,
} from "../services/itemsDiscount.service";

export const getAllItemsDiscountController = async (req: Request, res: Response) => {
  try {
    const data = await getAllItemsDiscount();
    console.log(data)
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

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

export const createItemsDiscountController = async (req: Request, res: Response) => {
  try {
    const { itemIds } = req.body;
    if (!Array.isArray(itemIds) || itemIds.length === 0) { 
      return res.status(400).json({ message: "Phải chọn ít nhất 1 sản phẩm" });
    }
    const data = await createItemsDiscount(req.body);
    return res.status(201).json(data);
  } catch (err: any) {
    if (err.message === "ITEMS_NOT_FOUND") {  
      return res.status(400).json({ message: "Một số sản phẩm không tồn tại" });
    }
    if (err.message === "INVALID_DISCOUNT_AMOUNT" || err.message === "INVALID_DATE_RANGE") {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: "Server error" });
  }
};


export const updateItemsDiscountController = async (req: Request, res: Response) => {
  try {
    const { itemIds } = req.body;
    if (itemIds !== undefined && (!Array.isArray(itemIds) || itemIds.length === 0)) { 
      return res.status(400).json({ message: "Phải chọn ít nhất 1 sản phẩm nếu cập nhật" });
    }
    const data = await updateItemsDiscount(Number(req.params.id), req.body);
    return res.json(data);
  } catch (err: any) {
    if (err.message === "DISCOUNT_NOT_FOUND") {
      return res.status(404).json({ message: "Discount not found" });
    }
    if (err.message === "ITEMS_NOT_FOUND" || err.message === "INVALID_DISCOUNT_AMOUNT" || err.message === "INVALID_DATE_RANGE") { 
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

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