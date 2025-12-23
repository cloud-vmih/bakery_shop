import { Request, Response } from "express";
import { getAllStaff, createStaff, updateStaff, deleteStaff, getStaffById } from "../services/staff.service";


export const StaffController = {
  create: async (req: Request, res: Response) => {
  try {
    const staff = await createStaff(req.body);
    res.status(201).json(staff);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
},

  getAll: async (_: Request, res: Response) => {
    return res.json(await getAllStaff());
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

  search: async (req: Request, res: Response) => {
    return res.json({ message: "search staff" });
  },

  lock: async (req: Request, res: Response) => {
    return res.json({ message: "locked staff" });
  },

  unlock: async (req: Request, res: Response) => {
    return res.json({ message: "unlocked staff" });
  },
};

