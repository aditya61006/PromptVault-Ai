import { Router } from 'express';
import { createCategory, listCategories } from '../controllers/categoryController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', listCategories);
router.post('/', protect, restrictTo('admin'), createCategory);

export default router;
