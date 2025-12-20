import { Request, Response } from "express";
import { findAddressesByCustomerId } from "../db/address.db";

export const getMyAddresses = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const addresses = await findAddressesByCustomerId(userId);
    return res.json(addresses);
  } catch (err) {
    return res.status(500).json({ message: "Cannot load addresses" });
  }
};
