import { Router } from "express";
import * as branchController from "../controller/branch.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.post("/create", verifyToken, branchController.createBranchWithAddres);
router.put("/update/:id", verifyToken, branchController.updateBranchWithAddres);
router.delete("/delete/:id", verifyToken, branchController.deleteBranch);
router.get("/", branchController.getBranches)

export default router;