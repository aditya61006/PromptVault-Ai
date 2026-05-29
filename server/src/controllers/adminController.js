import AuditLog from '../models/AuditLog.js';
import Prompt from '../models/Prompt.js';
import PromptVersion from '../models/PromptVersion.js';
import Purchase from '../models/Purchase.js';
import Report from '../models/Report.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';
import { writeAuditLog } from '../utils/audit.js';
import catchAsync from '../utils/catchAsync.js';

export const platformStats = catchAsync(async (req, res) => {
  const [users, prompts, revenue, reports, recentPurchases] = await Promise.all([
    User.countDocuments(),
    Prompt.countDocuments(),
    Purchase.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Report.countDocuments({ status: { $in: ['open', 'reviewing'] } }),
    Purchase.find({ status: 'paid' }).populate('user', 'name email').populate('prompt', 'title').sort('-createdAt').limit(8)
  ]);
  res.json({ users, prompts, revenue: revenue[0]?.total || 0, openReports: reports, recentPurchases });
});

export const moderatePrompt = catchAsync(async (req, res) => {
  const prompt = await Prompt.findByIdAndUpdate(req.params.id, { status: req.body.status, rejectionReason: req.body.rejectionReason }, { new: true });
  await writeAuditLog(req, 'prompt.moderate', 'Prompt', prompt._id, { status: prompt.status, rejectionReason: prompt.rejectionReason });
  res.json({ prompt });
});

export const listAllPrompts = catchAsync(async (req, res) => {
  const includeArchived = req.query.includeArchived === 'true';
  const filter = includeArchived ? {} : { status: { $ne: 'archived' } };
  const prompts = await Prompt.find(filter).populate('creator', 'name email').sort('-createdAt').limit(200);
  res.json({ prompts });
});

export const auditLogs = catchAsync(async (req, res) => {
  const logs = await AuditLog.find().populate('actor', 'name email role').sort('-createdAt').limit(100);
  res.json({ logs });
});

export const hardDeletePrompt = catchAsync(async (req, res) => {
  const prompt = await Prompt.findById(req.params.id);
  if (!prompt) return res.status(204).end();

  const media = Array.isArray(prompt.previewMedia) ? prompt.previewMedia : [];
  const publicIds = media.map((m) => m?.publicId).filter(Boolean);

  if (publicIds.length > 0 && process.env.CLOUDINARY_CLOUD_NAME) {
    await Promise.allSettled(
      publicIds.map((publicId) =>
        cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
      )
    );
  }

  await Promise.all([
    PromptVersion.deleteMany({ prompt: prompt._id }),
    Review.deleteMany({ prompt: prompt._id }),
    Report.deleteMany({ prompt: prompt._id }),
    User.updateMany(
      {},
      {
        $pull: {
          bookmarks: prompt._id,
          purchasedPrompts: prompt._id,
          recentlyViewed: { prompt: prompt._id }
        }
      }
    )
  ]);

  await Prompt.deleteOne({ _id: prompt._id });
  await writeAuditLog(req, 'prompt.hard_delete', 'Prompt', prompt._id, { title: prompt.title, deletedMedia: publicIds.length });
  res.status(204).end();
});
