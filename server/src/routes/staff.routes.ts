import { Router } from "express";
import { StaffController } from "../controller/staff.controller";

const router = Router();

router.post("/", StaffController.create);
router.get("/", StaffController.getAll);
router.get("/:id", StaffController.getById);
router.patch("/:id", StaffController.update);
router.delete("/:id", StaffController.delete);

// các route thêm:
router.get("/search", StaffController.search);
router.patch("/:id/lock", StaffController.lock);
router.patch("/:id/unlock", StaffController.unlock);

export default router;
