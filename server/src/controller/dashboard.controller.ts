// src/controllers/dashboard.controller.ts
import { Request, Response } from "express";
import { getDashboardData } from "../servies/dashboard.service";

export const getDashboard = async (req: Request, res: Response) => { // ← THÊM "export const" (bắt buộc)
  console.log("Dashboard route hit!");
  try {
    const { from, to } = req.query;
    const data = await getDashboardData({
      from: from ? String(from) : undefined,
      to: to ? String(to) : undefined,
    });
    res.json(data);
  } catch (error: any) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: error.message || "Lỗi tải dữ liệu dashboard" });
  }
};