import CreatorEarning from '../models/CreatorEarning.js';
import Prompt from '../models/Prompt.js';
import Purchase from '../models/Purchase.js';
import catchAsync from '../utils/catchAsync.js';

export const dashboard = catchAsync(async (req, res) => {
  const [prompts, purchases, earnings] = await Promise.all([
    Prompt.find({ creator: req.user._id }).sort('-createdAt'),
    Purchase.find({ creator: req.user._id, status: 'paid' }).populate('prompt', 'title'),
    CreatorEarning.aggregate([{ $match: { creator: req.user._id } }, { $group: { _id: '$status', total: { $sum: '$netAmount' } } }])
  ]);
  res.json({ prompts, purchases, earnings });
});
