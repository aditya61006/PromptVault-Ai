import Report from '../models/Report.js';
import catchAsync from '../utils/catchAsync.js';

export const createReport = catchAsync(async (req, res) => {
  const report = await Report.create({
    reporter: req.user._id,
    prompt: req.body.prompt,
    user: req.body.user,
    reason: req.body.reason,
    details: req.body.details
  });
  res.status(201).json({ report });
});

export const listReports = catchAsync(async (req, res) => {
  const reports = await Report.find().populate('reporter', 'name email').populate('prompt', 'title').sort('-createdAt');
  res.json({ reports });
});

export const updateReport = catchAsync(async (req, res) => {
  const report = await Report.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json({ report });
});
