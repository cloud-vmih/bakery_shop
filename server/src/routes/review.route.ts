import { Router } from 'express';
import { getReviewsController, replyReviewController, deleteReviewController } from '../controllers/review.controller';
import { verifyToken, verifyAdminOrStaff } from '../middleware/verifyToken';


const router = Router();

router.get('/', verifyToken, verifyAdminOrStaff, getReviewsController);
router.post('/:id/reply', verifyToken, verifyAdminOrStaff, replyReviewController);
router.delete(`/:id`, verifyToken, verifyAdminOrStaff, deleteReviewController);

export default router;

