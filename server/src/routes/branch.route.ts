import { Router } from "express";
import * as branchController from "../controllers/branch.controller";
import { verifyToken, verifyAdmin } from "../middleware/verifyToken";

const router = Router();

router.post("/create", verifyToken, verifyAdmin, branchController.createBranchWithAddres);
router.put("/update/:id", verifyToken,verifyAdmin, branchController.updateBranchWithAddres);
router.delete("/delete/:id",verifyToken, verifyAdmin, branchController.deleteBranch);
router.get("/", branchController.getBranches)

export default router;