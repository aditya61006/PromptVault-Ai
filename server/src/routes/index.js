import { Router } from 'express';
import authRoutes from './authRoutes.js';
import promptRoutes from './promptRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import userRoutes from './userRoutes.js';
import adminRoutes from './adminRoutes.js';
import creatorRoutes from './creatorRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import reportRoutes from './reportRoutes.js';
import aiRoutes from './aiRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/prompts', promptRoutes);
router.use('/payments', paymentRoutes);
router.use('/reviews', reviewRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/creator', creatorRoutes);
router.use('/notifications', notificationRoutes);
router.use('/categories', categoryRoutes);
router.use('/reports', reportRoutes);
router.use('/ai', aiRoutes);
router.use('/uploads', uploadRoutes);

export default router;
