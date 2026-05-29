import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: process.env.JWT_EXPIRES_IN || '15m' });
export const signRefreshToken = () => crypto.randomBytes(48).toString('hex');

export const setAuthCookies = (res, token, refreshToken) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('jwt', token, {
    maxAge: 15 * 60 * 1000,
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
  });
  res.cookie('refreshToken', refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
  });
};

export const sendToken = async (user, statusCode, res) => {
  const token = signToken(user._id);
  const refreshToken = signRefreshToken();
  user.setRefreshToken(refreshToken);
  await user.save({ validateBeforeSave: false });
  setAuthCookies(res, token, refreshToken);
  user.password = undefined;
  user.refreshTokenHash = undefined;
  user.refreshTokenExpires = undefined;
  res.status(statusCode).json({ token, user });
};

export const protect = catchAsync(async (req, res, next) => {
  let token = req.cookies.jwt;
  if (req.headers.authorization?.startsWith('Bearer ')) token = req.headers.authorization.split(' ')[1];
  if (!token) throw new AppError('Please log in to continue.', 401);
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
  } catch (error) {
    throw new AppError('Your session is invalid or expired. Please log in again.', 401);
  }
  const user = await User.findById(decoded.id).select('+role +isActive');
  if (!user || !user.isActive) throw new AppError('User no longer exists or is suspended.', 401);
  req.user = user;
  next();
});

export const optionalAuth = catchAsync(async (req, res, next) => {
  let token = req.cookies.jwt;
  if (req.headers.authorization?.startsWith('Bearer ')) token = req.headers.authorization.split(' ')[1];
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    req.user = await User.findById(decoded.id).select('+role +isActive');
  } catch (error) {
    req.user = undefined;
  }
  next();
});

export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return next(new AppError('You do not have permission for this action.', 403));
  next();
};
