import Prompt from '../models/Prompt.js';
import PromptVersion from '../models/PromptVersion.js';
import Purchase from '../models/Purchase.js';
import AppError from '../utils/AppError.js';
import { writeAuditLog } from '../utils/audit.js';
import catchAsync from '../utils/catchAsync.js';
import { cleanupMedia } from '../services/cloudinaryService.js';

const allowedPlatforms = ['ChatGPT', 'Midjourney', 'Claude', 'Gemini', 'Stable Diffusion', 'Sora', 'Suno', 'Runway', 'Pika', 'Other'];

function sanitizePromptPayload(body) {
  const platforms = Array.isArray(body.platforms) ? body.platforms : [];
  const invalidPlatform = platforms.find((platform) => !allowedPlatforms.includes(platform));
  if (invalidPlatform) throw new AppError(`Unsupported platform: ${invalidPlatform}. Use Other if needed.`, 400);

  const isPremium = Boolean(body.isPremium);
  const price = isPremium ? Number(body.price || 0) : 0;
  if (isPremium && price <= 0) throw new AppError('Premium prompts need a price greater than 0.', 400);

  return {
    title: body.title,
    description: body.description,
    category: body.category,
    categoryName: body.categoryName,
    tags: Array.isArray(body.tags) ? body.tags : [],
    promptText: body.promptText,
    platforms,
    isPremium,
    price,
    previewMedia: Array.isArray(body.previewMedia) ? body.previewMedia : [],
    sampleOutputs: Array.isArray(body.sampleOutputs) ? body.sampleOutputs : [],
    usageInstructions: body.usageInstructions
  };
}

export const listPrompts = catchAsync(async (req, res) => {
  const { q, category, tag, sort = 'popular', premium, page = 1, limit = 12 } = req.query;
  const filter = { status: 'approved' };
  if (category) filter.categoryName = category;
  if (tag) filter.tags = tag;
  if (premium === 'true') filter.isPremium = true;
  if (premium === 'false') filter.isPremium = false;
  if (q) filter.$text = { $search: q };

  const sortMap = {
    latest: '-createdAt',
    rating: '-averageRating',
    popular: '-purchasesCount -views',
    free: 'price',
    premium: '-price'
  };
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Prompt.find(filter).populate('creator', 'name avatar isVerified').sort(sortMap[sort] || sortMap.popular).skip(skip).limit(Number(limit)),
    Prompt.countDocuments(filter)
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

export const getPrompt = catchAsync(async (req, res) => {
  const prompt = await Prompt.findById(req.params.id).populate('creator', 'name avatar bio isVerified');
  if (!prompt) throw new AppError('Prompt not found.', 404);
  prompt.views += 1;
  await prompt.save({ validateBeforeSave: false });
  if (req.user) {
    req.user.recentlyViewed = [
      { prompt: prompt._id, viewedAt: new Date() },
      ...req.user.recentlyViewed.filter((item) => !item.prompt.equals(prompt._id))
    ].slice(0, 20);
    await req.user.save({ validateBeforeSave: false });
  }
  const canUnlock = !prompt.isPremium || (req.user && (await Purchase.exists({ user: req.user._id, prompt: prompt._id, status: 'paid' })));
  const fullPrompt = canUnlock ? await Prompt.findById(req.params.id).select('+promptText') : null;
  res.json({ prompt, promptText: fullPrompt?.promptText, unlocked: Boolean(canUnlock) });
});

export const createPrompt = catchAsync(async (req, res) => {
  const payload = sanitizePromptPayload(req.body);
  try {
    const prompt = await Prompt.create({ ...payload, creator: req.user._id, status: req.body.status || 'approved' });
    await PromptVersion.create({ prompt: prompt._id, version: 1, snapshot: prompt.toObject(), changedBy: req.user._id, changeNote: 'Initial creation' });
    await writeAuditLog(req, 'prompt.create', 'Prompt', prompt._id, { title: prompt.title, status: prompt.status });
    res.status(201).json({ prompt });
  } catch (err) {
    // If media was already uploaded to Cloudinary but DB write failed, cleanup to avoid orphaned files.
    await cleanupMedia(payload.previewMedia);
    throw err;
  }
});

export const updatePrompt = catchAsync(async (req, res) => {
  const prompt = await Prompt.findById(req.params.id).select('+promptText');
  if (!prompt) throw new AppError('Prompt not found.', 404);
  const payload = sanitizePromptPayload({ ...prompt.toObject(), ...req.body });
  Object.assign(prompt, payload, { status: req.body.status || prompt.status, version: prompt.version + 1 });
  await prompt.save();
  await PromptVersion.create({ prompt: prompt._id, version: prompt.version, snapshot: prompt.toObject(), changedBy: req.user._id, changeNote: req.body.changeNote });
  await writeAuditLog(req, 'prompt.update', 'Prompt', prompt._id, { title: prompt.title, version: prompt.version });
  res.json({ prompt });
});

export const deletePrompt = catchAsync(async (req, res) => {
  const prompt = await Prompt.findById(req.params.id);
  if (!prompt) throw new AppError('Prompt not found.', 404);
  prompt.status = 'archived';
  await prompt.save({ validateBeforeSave: false });
  await writeAuditLog(req, 'prompt.archive', 'Prompt', prompt._id, { title: prompt.title });
  res.status(204).end();
});

export const bookmarkPrompt = catchAsync(async (req, res) => {
  const exists = req.user.bookmarks.some((id) => id.equals(req.params.id));
  req.user.bookmarks = exists ? req.user.bookmarks.filter((id) => !id.equals(req.params.id)) : [...req.user.bookmarks, req.params.id];
  await req.user.save({ validateBeforeSave: false });
  res.json({ bookmarked: !exists });
});

export const likePrompt = catchAsync(async (req, res) => {
  const prompt = await Prompt.findById(req.params.id);
  if (!prompt || prompt.status !== 'approved') throw new AppError('Prompt not found.', 404);
  const exists = prompt.likes.some((id) => id.equals(req.user._id));
  prompt.likes = exists ? prompt.likes.filter((id) => !id.equals(req.user._id)) : [...prompt.likes, req.user._id];
  await prompt.save({ validateBeforeSave: false });
  res.json({ liked: !exists, likesCount: prompt.likes.length });
});

export const myRecentlyViewed = catchAsync(async (req, res) => {
  const user = await req.user.populate('recentlyViewed.prompt', 'title slug previewMedia price isPremium categoryName averageRating reviewsCount');
  res.json({ items: user.recentlyViewed });
});

export const downloadPrompt = catchAsync(async (req, res) => {
  const prompt = await Prompt.findById(req.params.id).select('+promptText');
  if (!prompt) throw new AppError('Prompt not found.', 404);
  const ownsPrompt = !prompt.isPremium || (await Purchase.exists({ user: req.user._id, prompt: prompt._id, status: 'paid' }));
  if (!ownsPrompt) throw new AppError('Purchase required to download this prompt.', 403);
  res.json({ promptId: prompt._id, title: prompt.title, promptText: prompt.promptText, usageInstructions: prompt.usageInstructions });
});
