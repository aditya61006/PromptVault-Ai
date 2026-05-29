export function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server error';

  // Cloudinary errors are often opaque; surface a cleaner message.
  if (err.name === 'Error' && /cloudinary/i.test(message)) {
    return res.status(502).json({ status: 'error', message: 'Media upload failed (Cloudinary). Check Cloudinary credentials and folder permissions.' });
  }
  res.status(statusCode).json({
    status: statusCode >= 500 ? 'error' : 'fail',
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
}
