import { Router } from 'express';
import { bookmarkPrompt, createPrompt, deletePrompt, downloadPrompt, getPrompt, likePrompt, listPrompts, myRecentlyViewed, updatePrompt } from '../controllers/promptController.js';
import { optionalAuth, protect, restrictTo } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', listPrompts);
router.get('/recently-viewed/me', protect, myRecentlyViewed);
router.get('/:id', optionalAuth, getPrompt);
router.get('/:id/download', protect, downloadPrompt);
router.post('/', protect, restrictTo('admin'), createPrompt);
router.patch('/:id', protect, restrictTo('admin'), updatePrompt);
router.delete('/:id', protect, restrictTo('admin'), deletePrompt);
router.post('/:id/bookmark', protect, bookmarkPrompt);
router.post('/:id/like', protect, likePrompt);

export default router;
