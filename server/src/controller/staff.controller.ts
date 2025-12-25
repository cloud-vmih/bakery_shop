import { Request, Response } from "express";
import {
  getAllStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffById,
  lockStaff,
  unlockStaff,
} from "../servies/staff.service";


export const StaffController = {
  create: async (req: Request, res: Response) => {
  try {
    const staff = await createStaff(req.body);
    res.status(201).json(staff);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
},

  getAll: async (req: Request, res: Response) => {
  try {
    const keyword = req.query.keyword as string || "";
    const staffList = await getAllStaff(keyword);
    res.json(staffList);
  } catch (error: any) {
    console.error("Lỗi getAll:", error);  // Log để xem chi tiết
    res.status(500).json({ error: error.message || "Lỗi DB" });
  }
},


  getById: async (req: Request, res: Response) => {
    return res.json(await getStaffById(Number(req.params.id)));
  },

  update: async (req: Request, res: Response) => {
    return res.json(await updateStaff(Number(req.params.id), req.body));
  },

  delete: async (req: Request, res: Response) => {
    return res.json(await deleteStaff(Number(req.params.id)));
  },

  lock: async (req: Request, res: Response) => {
  return res.json(await lockStaff(Number(req.params.id)));
},


  unlock: async (req: Request, res: Response) => {
  return res.json(await unlockStaff(Number(req.params.id)));
},

};

