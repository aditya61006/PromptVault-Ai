import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['purchase', 'refund', 'withdrawal', 'coin_credit'], required: true },
    amount: Number,
    currency: { type: String, default: 'INR' },
    provider: { type: String, default: 'razorpay' },
    providerReference: String,
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
    metadata: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

export default mongoose.model('Transaction', transactionSchema);
