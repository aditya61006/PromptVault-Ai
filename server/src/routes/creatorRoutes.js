import { Router } from 'express';
import { dashboard } from '../controllers/creatorController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/dashboard', protect, restrictTo('admin'), dashboard);

export default router;
