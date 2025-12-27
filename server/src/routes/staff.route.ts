import { Router } from "express";
import { StaffController } from "../controllers/staff.controller";
import { verifyToken, verifyAdmin } from "../middleware/verifyToken";

const router = Router();

router.post("/", verifyToken, verifyAdmin, StaffController.create);
router.get("/", verifyToken, verifyAdmin, StaffController.getAll);
router.get("/:id", verifyToken, verifyAdmin, StaffController.getById);
router.patch("/:id", verifyToken, verifyAdmin, StaffController.update);
router.delete("/:id", verifyToken, verifyAdmin, StaffController.delete);

// các route thêm:
router.get("/search", verifyToken, verifyAdmin, StaffController.search);
router.patch("/:id/lock", verifyToken, verifyAdmin, StaffController.lock);
router.patch("/:id/unlock", verifyToken, verifyAdmin, StaffController.unlock);

export default router;
