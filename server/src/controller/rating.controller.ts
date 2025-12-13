// controllers/rating.controller.ts
import { Request, Response } from "express";
import { ratingService } from "../services/rating.service";

export const addOrUpdateRatingController = async (req: Request, res: Response) => {
  try {
    const { itemID, contents } = req.body;
    const customerID = (req as any).user.id; // giả sử middleware auth đã gán user.id
    const rating = await ratingService.addOrUpdateRating(customerID, itemID, contents);
    res.json(rating);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getItemRatingsController = async (req: Request, res: Response) => {
  try {
    const itemID = Number(req.params.itemID);
    const ratings = await ratingService.getItemRatings(itemID);
    res.json(ratings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getCustomerRatingsController = async (req: Request, res: Response) => {
  try {
    const customerID = Number(req.params.customerID);
    const ratings = await ratingService.getCustomerRatings(customerID);
    res.json(ratings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteRatingController = async (req: Request, res: Response) => {
  try {
    const customerID = Number((req as any).user.id);
    const itemID = Number(req.params.itemID);
    await ratingService.removeRating(customerID, itemID);
    res.json({ message: "Xóa rating thành công" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
