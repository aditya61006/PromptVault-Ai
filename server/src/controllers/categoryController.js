import slugify from 'slugify';
import Category from '../models/Category.js';
import catchAsync from '../utils/catchAsync.js';

export const listCategories = catchAsync(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort('name');
  res.json({ categories });
});

export const createCategory = catchAsync(async (req, res) => {
  const category = await Category.create({
    name: req.body.name,
    slug: slugify(req.body.name, { lower: true, strict: true }),
    description: req.body.description,
    icon: req.body.icon
  });
  res.status(201).json({ category });
});
