import { Router } from 'express';
import passport from 'passport';
import { forgotPassword, login, logout, me, refresh, register, resetPassword, verifyEmail } from '../controllers/authController.js';
import { optionalAuth, protect } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import { authLimiter } from '../middleware/rateLimiters.js';
import { loginRules, registerRules } from '../validations/authValidation.js';
import '../services/passport.js';

const router = Router();

router.post('/register', authLimiter, registerRules, validate, register);
router.post('/login', authLimiter, loginRules, validate, login);
router.post('/logout', optionalAuth, logout);
router.post('/refresh', refresh);
router.get('/me', protect, me);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login` }), (req, res) => {
  res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${req.user.token}`);
});

export default router;
