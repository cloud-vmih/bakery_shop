import { Router } from "express";
import { StaffController } from "../controllers/staff.controller";
// routes/staff.ts
const router = Router();
router.post('/', StaffController.create);
router.get('/', StaffController.getAll);
router.get('/:id', StaffController.getById);
router.patch('/:id', StaffController.update);
router.delete('/:id', StaffController.delete);
router.patch('/:id/lock', StaffController.lock);
router.patch('/:id/unlock', StaffController.unlock);
export default router;
