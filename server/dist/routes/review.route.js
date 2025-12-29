"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = require("../controllers/review.controller");
const verifyToken_1 = require("../middleware/verifyToken");
// Giả sử có auth middleware
// import { authenticateAdminOrStaff } from '../middleware/auth'; // Implement riêng
const router = (0, express_1.Router)();
router.get('/', review_controller_1.getReviewsController);
router.post('/:id/reply', verifyToken_1.verifyToken, review_controller_1.replyReviewController);
router.delete(`/:id`, review_controller_1.deleteReviewController);
exports.default = router;
