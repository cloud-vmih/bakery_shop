import { Router } from "express";
import * as InventoryController from "../controllers/inventory.controller";
import { verifyToken } from "../middleware/verifyToken";
import { verifyAdmin } from "../middleware/verifyToken";

const router = Router();

router.get("/inventory", InventoryController.getAllItems);
router.put(
  "/inventory/:branchId",
  verifyToken,
  verifyAdmin,
  InventoryController.updateBranchInventory
);

router.post(
  "/inventory/check",
  verifyToken,
  InventoryController.checkInventory
);

export default router;
