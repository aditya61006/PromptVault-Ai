import { Router } from 'express';
import { enhancePrompt, similarPrompts } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/enhance', protect, enhancePrompt);
router.get('/similar/:id', similarPrompts);

export default router;
