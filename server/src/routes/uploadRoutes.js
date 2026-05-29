import { Router } from 'express';
import { uploadMedia } from '../controllers/uploadController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.post('/media', protect, restrictTo('admin'), upload.array('media', 6), uploadMedia);

export default router;
