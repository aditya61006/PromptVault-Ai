import Prompt from '../models/Prompt.js';
import Review from '../models/Review.js';
import catchAsync from '../utils/catchAsync.js';

export const createReview = catchAsync(async (req, res) => {
  const review = await Review.findOneAndUpdate(
    { user: req.user._id, prompt: req.params.promptId },
    { user: req.user._id, prompt: req.params.promptId, rating: req.body.rating, comment: req.body.comment },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  const stats = await Review.aggregate([{ $match: { prompt: review.prompt } }, { $group: { _id: '$prompt', avg: { $avg: '$rating' }, count: { $sum: 1 } } }]);
  await Prompt.findByIdAndUpdate(review.prompt, { averageRating: stats[0]?.avg || 0, reviewsCount: stats[0]?.count || 0 });
  res.status(201).json({ review });
});

export const listReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find({ prompt: req.params.promptId }).populate('user', 'name avatar').sort('-createdAt');
  res.json({ reviews });
});
