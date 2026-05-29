import { Router } from 'express';
import { followCreator, listUsers, suspendUser, updateProfile } from '../controllers/userController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = Router();

router.patch('/me', protect, updateProfile);
router.post('/:id/follow', protect, followCreator);
router.get('/', protect, restrictTo('admin'), listUsers);
router.patch('/:id/suspend', protect, restrictTo('admin'), suspendUser);

export default router;
