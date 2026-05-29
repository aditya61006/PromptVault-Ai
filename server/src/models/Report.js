import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    prompt: { type: mongoose.Schema.Types.ObjectId, ref: 'Prompt' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: { type: String, required: true },
    details: String,
    status: { type: String, enum: ['open', 'reviewing', 'resolved', 'dismissed'], default: 'open' }
  },
  { timestamps: true }
);

export default mongoose.model('Report', reportSchema);
