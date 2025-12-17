// src/controller/cart.controller.ts
import { Request, Response } from "express";
import { CartService } from "../services/cart.service";

const cartService = new CartService();

export const addToCart = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { itemId, quantity = 1 } = req.body;

    if (!itemId) {
      return res.status(400).json({ message: "Thiếu itemId" });
    }

    await cartService.addItem(userId, itemId, quantity);
    return res.json({ message: "Đã thêm vào giỏ hàng thành công!" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Lỗi khi thêm vào giỏ" });
  }
};

export const getCart = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const cart = await cartService.getCart(userId);
    return res.json(cart);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server" });
  }
};