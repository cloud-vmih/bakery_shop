// controllers/branch.controller.ts
import { Request, Response } from "express";
import * as branchService from "../servies/branch.service";

export const createBranchWithAddres = async (req: Request, res: Response) => {
  try {
    const { name, placeId, formattedAddress, latitude, longitude } = req.body;

    await branchService.createBranch(name, placeId, formattedAddress, latitude, longitude);

    res.status(201).json({message: "Create successfully!"});
  } catch (err: any) {
    res.status(400).json({
      message: err.message || "Create branch failed",
    });
  }
};

export const getBranches = async (req: Request, res: Response) => {
  console.log("OK");
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
    await branchService.updateBranch(branchId, payload)

    res.status(201).json({message: "Update successfully!"});
  } catch (err: any) {
    res.status(400).json({
      message: err.message || "Update branch failed",
    });
  }
};

export const deleteBranch = async (req: Request, res: Response) => {
  try {
    const branchId = Number(req.params.id);
    await branchService.deleteBranchService(branchId)
    res.status(201).json({message: "Deleted successfully!"});
  } catch (err: any) {
    res.status(400).json({
      message: err.message || "Update branch failed",
    });
  }
};

