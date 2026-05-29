import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['purchase', 'review', 'payout', 'moderation', 'system'], default: 'system' },
    title: String,
    message: String,
    readAt: Date,
    link: String
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
