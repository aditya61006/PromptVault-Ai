import { Router } from 'express';
import { listNotifications, markRead } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, listNotifications);
router.patch('/:id/read', protect, markRead);

export default router;
