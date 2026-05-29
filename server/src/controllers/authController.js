import crypto from 'crypto';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import { sendToken, setAuthCookies, signRefreshToken, signToken } from '../middleware/authMiddleware.js';

export const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) throw new AppError('Email is already registered.', 409);
  const emailVerificationToken = crypto.randomBytes(32).toString('hex');
  const user = await User.create({ name, email, password, role: 'user', emailVerificationToken, emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000 });
  await sendToken(user, 201, res);
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) throw new AppError('Invalid email or password.', 401);
  await sendToken(user, 200, res);
});

export const logout = catchAsync(async (req, res) => {
  if (req.user) {
    req.user.refreshTokenHash = undefined;
    req.user.refreshTokenExpires = undefined;
    await req.user.save({ validateBeforeSave: false });
  }
  res.clearCookie('jwt');
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
});

export const refresh = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!refreshToken) throw new AppError('Refresh token missing. Please log in again.', 401);
  const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  const user = await User.findOne({ refreshTokenHash, refreshTokenExpires: { $gt: Date.now() }, isActive: true }).select('+refreshTokenHash +refreshTokenExpires');
  if (!user) throw new AppError('Refresh session expired. Please log in again.', 401);
  const token = signToken(user._id);
  const nextRefreshToken = signRefreshToken();
  user.setRefreshToken(nextRefreshToken);
  await user.save({ validateBeforeSave: false });
  setAuthCookies(res, token, nextRefreshToken);
  user.refreshTokenHash = undefined;
  user.refreshTokenExpires = undefined;
  res.json({ token, user });
});

export const me = catchAsync(async (req, res) => {
  res.json({ user: req.user });
});

export const forgotPassword = catchAsync(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new AppError('No user found for this email.', 404);
  const resetToken = user.createResetToken();
  await user.save({ validateBeforeSave: false });
  res.json({ message: 'Password reset token generated. Connect SMTP to send email.', resetToken });
});

export const resetPassword = catchAsync(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });
  if (!user) throw new AppError('Reset token is invalid or expired.', 400);
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  await sendToken(user, 200, res);
});

export const verifyEmail = catchAsync(async (req, res) => {
  const user = await User.findOne({ emailVerificationToken: req.params.token, emailVerificationExpires: { $gt: Date.now() } });
  if (!user) throw new AppError('Verification link is invalid or expired.', 400);
  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });
  res.json({ message: 'Email verified.' });
});
