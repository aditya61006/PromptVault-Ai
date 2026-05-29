import { Router } from 'express';
import { auditLogs, hardDeletePrompt, listAllPrompts, moderatePrompt, platformStats } from '../controllers/adminController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect, restrictTo('admin'));
router.get('/stats', platformStats);
router.get('/prompts', listAllPrompts);
router.delete('/prompts/:id/hard-delete', hardDeletePrompt);
router.get('/audit-logs', auditLogs);
router.patch('/prompts/:id/moderate', moderatePrompt);

export default router;
