import { Router } from 'express';
import { getReviewsController, replyReviewController, deleteReviewController } from '../controller/review.controller';
import { verifyToken } from '../middleware/verifyToken';
// Giả sử có auth middleware
// import { authenticateAdminOrStaff } from '../middleware/auth'; // Implement riêng

const router = Router();

router.get('/', getReviewsController);
router.post('/:id/reply', verifyToken, replyReviewController);
router.delete(`/:id`, deleteReviewController);

export default router;

