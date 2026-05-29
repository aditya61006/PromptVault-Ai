import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';

export const updateProfile = catchAsync(async (req, res) => {
  const allowed = ['name', 'bio', 'avatar'];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) req.user[field] = req.body[field];
  });
  await req.user.save({ validateBeforeSave: false });
  res.json({ user: req.user });
});

export const followCreator = catchAsync(async (req, res) => {
  const exists = req.user.following.some((id) => id.equals(req.params.id));
  req.user.following = exists ? req.user.following.filter((id) => !id.equals(req.params.id)) : [...req.user.following, req.params.id];
  await req.user.save({ validateBeforeSave: false });
  res.json({ following: !exists });
});

export const listUsers = catchAsync(async (req, res) => {
  const users = await User.find().select('-password').sort('-createdAt').limit(100);
  res.json({ users });
});

export const suspendUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  res.json({ user });
});
