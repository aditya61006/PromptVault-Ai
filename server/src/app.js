import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import mongoose from 'mongoose';
import morgan from 'morgan';
import xss from 'xss-clean';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((origin) => origin.trim());
const isProduction = process.env.NODE_ENV === 'production';

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    // Development: allow any origin so LAN/IP access works (Vite network URL).
    if (!isProduction) return callback(null, true);
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp({ whitelist: ['tags', 'platforms', 'category'] }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 250, standardHeaders: true, legacyHeaders: false }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    status: 'ok',
    service: 'PromptVault AI API',
    database: states[mongoose.connection.readyState] || 'unknown'
  });
});
app.get('/api/hi', (req, res) => res.json({ status: 'ok', service: 'hi you are talking to promptvault ai api server' }));

// Fail fast with a clear error when MongoDB isn't connected.
// This avoids confusing 500s during local setup (Atlas IP whitelist, wrong URI, etc.).
app.use('/api', (req, res, next) => {
  if (req.path === '/health' || req.path === '/hi') return next();
  if (mongoose.connection.readyState === 1) return next();
  return res.status(503).json({
    status: 'fail',
    message:
      'Database not connected. Configure MONGO_URI and ensure your current IP is allowed in MongoDB Atlas (Network Access whitelist).',
    database: mongoose.connection.readyState
  });
});

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

export default app;
