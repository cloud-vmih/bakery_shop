import { Router } from "express";
import { StaffController } from "../controllers/staff.controller";
import {verifyAdmin, verifyToken} from "../middleware/verifyToken";
// routes/staff.ts
const router = Router();
router.post('/', verifyToken, verifyAdmin, StaffController.create);
router.get('/', verifyToken, verifyAdmin, StaffController.getAll);
router.get('/:id', verifyToken, verifyAdmin, StaffController.getById);
router.patch('/:id', verifyToken, verifyAdmin, StaffController.update);
router.delete('/:id', verifyToken, verifyAdmin, StaffController.delete);
router.patch('/:id/lock', verifyToken, verifyAdmin, StaffController.lock);
router.patch('/:id/unlock', verifyToken, verifyAdmin, StaffController.unlock);
export default router;
