import { validationResult } from 'express-validator';
import AppError from '../utils/AppError.js';

export default function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new AppError(errors.array()[0].msg, 400));
  next();
}
