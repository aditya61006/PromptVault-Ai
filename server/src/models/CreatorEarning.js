import mongoose from 'mongoose';

const creatorEarningSchema = new mongoose.Schema(
  {
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    purchase: { type: mongoose.Schema.Types.ObjectId, ref: 'Purchase' },
    grossAmount: Number,
    platformFee: Number,
    netAmount: Number,
    status: { type: String, enum: ['pending', 'available', 'withdrawn'], default: 'pending' },
    withdrawalReference: String
  },
  { timestamps: true }
);

export default mongoose.model('CreatorEarning', creatorEarningSchema);
