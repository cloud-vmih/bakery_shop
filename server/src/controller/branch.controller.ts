// controllers/branch.controller.ts
import { Request, Response } from "express";
import * as branchService from "../servies/branch.service";

export const createBranchWithAddres = async (req: Request, res: Response) => {
  try {
    const { name, placeId, formattedAddress, latitude, longitude } = req.body;

    const result = await branchService.createBranch(name, placeId, formattedAddress, latitude, longitude);

    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({
      message: err.message || "Create branch failed",
    });
  }
};

export const getBranches = async (req: Request, res: Response) => {
  try {
    const result = await branchService.getAllBranchService();
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({
      message: err.message || "Create branch failed",
    });
  }
};

export const updateBranchWithAddres = async (req: Request, res: Response) => {
  try {
    const branchId = Number(req.params.id);
    const payload = req.body;

    const result = await branchService.updateBranch(branchId, payload)

    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({
      message: err.message || "Update branch failed",
    });
  }
};

export const deleteBranch = async (req: Request, res: Response) => {
  try {
    const branchId = Number(req.params.id);
    const result = await branchService.deleteBranchService(branchId)
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({
      message: err.message || "Update branch failed",
    });
  }
};

