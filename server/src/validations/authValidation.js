import { body } from 'express-validator';

export const registerRules = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name is required.'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required.'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
];

export const loginRules = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];
