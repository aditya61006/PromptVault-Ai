import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, minlength: 8, select: false },
    avatar: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    bio: String,
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    googleId: String,
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prompt' }],
    purchasedPrompts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prompt' }],
    recentlyViewed: [{ prompt: { type: mongoose.Schema.Types.ObjectId, ref: 'Prompt' }, viewedAt: Date }],
    refreshTokenHash: { type: String, select: false },
    refreshTokenExpires: { type: Date, select: false },
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerificationToken: String,
    emailVerificationExpires: Date
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.createResetToken = function createResetToken() {
  const token = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return token;
};

userSchema.methods.setRefreshToken = function setRefreshToken(token) {
  this.refreshTokenHash = crypto.createHash('sha256').update(token).digest('hex');
  this.refreshTokenExpires = Date.now() + 30 * 24 * 60 * 60 * 1000;
};

export default mongoose.model('User', userSchema);
