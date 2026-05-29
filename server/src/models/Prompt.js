import mongoose from 'mongoose';
import slugify from 'slugify';

const mediaSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String,
    type: { type: String, enum: ['image', 'video'], default: 'image' }
  },
  { _id: false }
);

const promptSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    categoryName: String,
    tags: [String],
    promptText: { type: String, required: true, select: false },
    platforms: [{ type: String, enum: ['ChatGPT', 'Midjourney', 'Claude', 'Gemini', 'Stable Diffusion', 'Sora', 'Suno', 'Runway', 'Pika', 'Other'] }],
    isPremium: { type: Boolean, default: false },
    price: { type: Number, default: 0, min: 0 },
    previewMedia: [mediaSchema],
    sampleOutputs: [{ title: String, content: String, mediaUrl: String }],
    usageInstructions: String,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    averageRating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    bookmarksCount: { type: Number, default: 0 },
    purchasesCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'pending', 'approved', 'rejected', 'archived'], default: 'pending' },
    rejectionReason: String,
    featuredUntil: Date,
    version: { type: Number, default: 1 }
  },
  { timestamps: true }
);

promptSchema.index({ title: 'text', description: 'text', tags: 'text', categoryName: 'text' });
promptSchema.index({ creator: 1, status: 1 });
promptSchema.index({ status: 1, categoryName: 1, createdAt: -1 });
promptSchema.index({ isPremium: 1, price: 1 });

promptSchema.pre('save', function makeSlug(next) {
  if (this.isModified('title')) this.slug = `${slugify(this.title, { lower: true, strict: true })}-${this._id.toString().slice(-6)}`;
  if (!this.isPremium) this.price = 0;
  next();
});

export default mongoose.model('Prompt', promptSchema);
