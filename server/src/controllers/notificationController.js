import Notification from '../models/Notification.js';
import catchAsync from '../utils/catchAsync.js';

export const listNotifications = catchAsync(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort('-createdAt').limit(50);
  res.json({ notifications });
});

export const markRead = catchAsync(async (req, res) => {
  await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { readAt: new Date() });
  res.json({ message: 'Notification marked as read.' });
});
