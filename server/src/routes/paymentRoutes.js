import { Router } from 'express';
import { createOrder, purchaseHistory, verifyPayment, webhook } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/webhook', webhook);
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/history', protect, purchaseHistory);

export default router;
