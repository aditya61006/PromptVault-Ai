import Prompt from '../models/Prompt.js';
import catchAsync from '../utils/catchAsync.js';

export const enhancePrompt = catchAsync(async (req, res) => {
  const { prompt, platform = 'ChatGPT', goal = 'higher quality output' } = req.body;
  const enhanced = [
    `Act as an expert ${platform} prompt engineer.`,
    `Goal: ${goal}.`,
    'Ask one clarifying question if critical context is missing.',
    'Return structured, production-ready output with assumptions and next steps.',
    `User prompt: ${prompt}`
  ].join('\n');
  res.json({ enhanced });
});

export const similarPrompts = catchAsync(async (req, res) => {
  const current = await Prompt.findById(req.params.id);
  const prompts = await Prompt.find({
    _id: { $ne: req.params.id },
    status: 'approved',
    $or: [{ categoryName: current?.categoryName }, { tags: { $in: current?.tags || [] } }]
  })
    .limit(8)
    .populate('creator', 'name avatar isVerified');
  res.json({ prompts });
});
