import { Router } from 'express';
import { createReview, listReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/:promptId', listReviews);
router.post('/:promptId', protect, createReview);

export default router;
