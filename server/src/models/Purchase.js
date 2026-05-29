import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    prompt: { type: mongoose.Schema.Types.ObjectId, ref: 'Prompt', required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: { type: String, enum: ['created', 'paid', 'failed', 'refunded'], default: 'created' },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    invoiceNumber: String,
    downloadedAt: Date
  },
  { timestamps: true }
);

purchaseSchema.index({ user: 1, prompt: 1 }, { unique: true });

export default mongoose.model('Purchase', purchaseSchema);
