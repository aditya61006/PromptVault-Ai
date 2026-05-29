import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Category from '../models/Category.js';
import Prompt from '../models/Prompt.js';
import User from '../models/User.js';

dotenv.config();

await connectDB();

// Important: use .save() so the User pre-save hook hashes passwords.
let admin = await User.findOne({ email: 'admin@promptvault.ai' });
if (!admin) admin = new User({ email: 'admin@promptvault.ai' });
admin.name = 'PromptVault Admin';
admin.password = 'Password123!';
admin.role = 'admin';
admin.isVerified = true;
admin.isActive = true;
await admin.save();

const categories = await Category.insertMany(
  ['Marketing', 'Image', 'Writing', 'Video', 'Music', 'Code', 'Business', 'Education'].map((name) => ({ name, slug: name.toLowerCase() })),
  { ordered: false }
).catch(() => Category.find());

await Prompt.deleteMany({});
await Prompt.insertMany([
  {
    title: 'Cinematic Product Launch Kit',
    description: 'Launch copy, image prompts, and social hooks for premium AI products.',
    category: categories[0]._id,
    categoryName: 'Marketing',
    tags: ['launch', 'brand', 'copywriting'],
    promptText: 'Act as a senior launch strategist for {{product}}...',
    platforms: ['ChatGPT', 'Midjourney', 'Claude'],
    isPremium: true,
    price: 2900,
    creator: admin._id,
    status: 'approved'
  }
]);

console.log('Seed complete. Admin: admin@promptvault.ai / Password123!');
await mongoose.connection.close();
