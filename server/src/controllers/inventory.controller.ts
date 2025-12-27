import { Request, Response } from "express";
import { getAll, updateQuanities } from "../services/inventory.service";
import cron from "node-cron";
import { deletedInventory } from "../db/inventory.db";

export const getAllItems = async (req: Request, res: Response) => {
  try {
    const result = await getAll();
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateBranchInventory = async (req: Request, res: Response) => {
  try {
    const { branchId } = req.params;
    const { payload } = req.body;

    const result = await updateQuanities(Number(branchId), payload);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

cron.schedule("*/1 * * * *", async () => {
  console.log("Running daily inventory cleanup...");
  try {
    await deletedInventory();
    console.log("Daily inventory cleanup completed");
  } catch (error) {
    console.error("Error in daily cleanup:", error);
  }
});
