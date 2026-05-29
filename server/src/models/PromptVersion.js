import mongoose from 'mongoose';

const promptVersionSchema = new mongoose.Schema(
  {
    prompt: { type: mongoose.Schema.Types.ObjectId, ref: 'Prompt', required: true },
    version: { type: Number, required: true },
    snapshot: { type: mongoose.Schema.Types.Mixed, required: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    changeNote: String
  },
  { timestamps: true }
);

promptVersionSchema.index({ prompt: 1, version: -1 }, { unique: true });

export default mongoose.model('PromptVersion', promptVersionSchema);
