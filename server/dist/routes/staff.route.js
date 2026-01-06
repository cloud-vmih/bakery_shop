"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const staff_controller_1 = require("../controllers/staff.controller");
<<<<<<< HEAD
// routes/staff.ts
const router = (0, express_1.Router)();
router.post('/', staff_controller_1.StaffController.create);
router.get('/', staff_controller_1.StaffController.getAll);
router.get('/:id', staff_controller_1.StaffController.getById);
router.patch('/:id', staff_controller_1.StaffController.update);
router.delete('/:id', staff_controller_1.StaffController.delete);
router.patch('/:id/lock', staff_controller_1.StaffController.lock);
router.patch('/:id/unlock', staff_controller_1.StaffController.unlock);
=======
const verifyToken_1 = require("../middleware/verifyToken");
// routes/staff.ts
const router = (0, express_1.Router)();
router.post('/', verifyToken_1.verifyToken, verifyToken_1.verifyAdmin, staff_controller_1.StaffController.create);
router.get('/', verifyToken_1.verifyToken, verifyToken_1.verifyAdmin, staff_controller_1.StaffController.getAll);
router.get('/:id', verifyToken_1.verifyToken, verifyToken_1.verifyAdmin, staff_controller_1.StaffController.getById);
router.patch('/:id', verifyToken_1.verifyToken, verifyToken_1.verifyAdmin, staff_controller_1.StaffController.update);
router.delete('/:id', verifyToken_1.verifyToken, verifyToken_1.verifyAdmin, staff_controller_1.StaffController.delete);
router.patch('/:id/lock', verifyToken_1.verifyToken, verifyToken_1.verifyAdmin, staff_controller_1.StaffController.lock);
router.patch('/:id/unlock', verifyToken_1.verifyToken, verifyToken_1.verifyAdmin, staff_controller_1.StaffController.unlock);
>>>>>>> origin/feature/cake-filling
exports.default = router;
