import { Request, Response, NextFunction } from "express";
import * as wishlistService from "../services/wishlist.service";

export const getWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customerId = (req as any).user.id;

    const items = await wishlistService.getWishlist(customerId);

    res.json(items); // ⭐ Item[]
  } catch (err) {
    next(err);
  }
};

export const addToWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customerId = (req as any).user.id;
    const itemId = Number(req.params.itemId);

    if (!itemId) {
      return res.status(400).json({ error: "INVALID_ITEM_ID" });
    }

    await wishlistService.addToWishlist(customerId, itemId);
    res.json({ message: "Đã thêm vào wishlist" });
  } catch (err) {
    next(err);
  }
};

export const removeFromWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customerId = (req as any).user.id;
    const itemId = Number(req.params.itemId);

    await wishlistService.removeFromWishlist(customerId, itemId);
    res.json({ message: "Đã xóa khỏi wishlist" });
  } catch (err) {
    next(err);
  }
};
