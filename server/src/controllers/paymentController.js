import crypto from 'crypto';
import Prompt from '../models/Prompt.js';
import Purchase from '../models/Purchase.js';
import CreatorEarning from '../models/CreatorEarning.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import { writeAuditLog } from '../utils/audit.js';
import catchAsync from '../utils/catchAsync.js';
import { razorpay } from '../config/razorpay.js';

export const createOrder = catchAsync(async (req, res) => {
  const prompt = await Prompt.findById(req.body.promptId);
  if (!prompt || prompt.status !== 'approved' || !prompt.isPremium) throw new AppError('Premium prompt not found.', 404);
  const existingPurchase = await Purchase.findOne({ user: req.user._id, prompt: prompt._id, status: 'paid' });
  if (existingPurchase) return res.json({ alreadyPurchased: true, purchase: existingPurchase });
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) throw new AppError('Razorpay keys are not configured.', 503);
  const amount = Math.round(prompt.price * 100);
  const order = await razorpay.orders.create({ amount, currency: 'INR', receipt: `pv_${prompt._id}_${Date.now()}` });
  const purchase = await Purchase.findOneAndUpdate(
    { user: req.user._id, prompt: prompt._id },
    { user: req.user._id, prompt: prompt._id, creator: prompt.creator, amount: prompt.price, razorpayOrderId: order.id, status: 'created' },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  res.status(201).json({ order, purchaseId: purchase._id, key: process.env.RAZORPAY_KEY_ID });
});

export const verifyPayment = catchAsync(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '').update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
  if (expected !== razorpay_signature) throw new AppError('Payment verification failed.', 400);
  const purchase = await Purchase.findOneAndUpdate({ razorpayOrderId: razorpay_order_id, user: req.user._id }, { status: 'paid', razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature, invoiceNumber: `PV-${Date.now()}` }, { new: true });
  if (!purchase) throw new AppError('Purchase not found.', 404);
  await Promise.all([
    CreatorEarning.create({ creator: purchase.creator, purchase: purchase._id, grossAmount: purchase.amount, platformFee: purchase.amount * 0.1, netAmount: purchase.amount * 0.9, status: 'available' }),
    Transaction.create({ user: purchase.user, type: 'purchase', amount: purchase.amount, providerReference: razorpay_payment_id, status: 'success' }),
    Prompt.findByIdAndUpdate(purchase.prompt, { $inc: { purchasesCount: 1 } }),
    User.findByIdAndUpdate(purchase.user, { $addToSet: { purchasedPrompts: purchase.prompt } }),
    writeAuditLog(req, 'payment.verify', 'Purchase', purchase._id, { prompt: purchase.prompt, amount: purchase.amount })
  ]);
  res.json({ purchase });
});

export const webhook = catchAsync(async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const expected = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '').update(req.body).digest('hex');
  if (signature !== expected) throw new AppError('Invalid webhook signature.', 400);
  res.json({ received: true });
});

export const purchaseHistory = catchAsync(async (req, res) => {
  const purchases = await Purchase.find({ user: req.user._id, status: 'paid' }).populate('prompt', 'title slug previewMedia price');
  res.json({ purchases });
});
