import { Request, Response } from "express";
import { getProfile, updateProfile } from "../services/user.service";

export const getProfileController = async (req: Request, res: Response) => {
  try {
    console.log((req as any).user.id);
    const user = await getProfile((req as any).user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const updateProfileController = async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const updatedUser = await updateProfile((req as any).user.id, updates);
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
