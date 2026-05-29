import { Router } from 'express';
import { createReport, listReports, updateReport } from '../controllers/reportController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', protect, createReport);
router.get('/', protect, restrictTo('admin'), listReports);
router.patch('/:id', protect, restrictTo('admin'), updateReport);

export default router;
