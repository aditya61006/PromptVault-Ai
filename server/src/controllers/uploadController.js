import { uploadBuffer } from '../services/cloudinaryService.js';
import catchAsync from '../utils/catchAsync.js';

export const uploadMedia = catchAsync(async (req, res) => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return res.status(503).json({ status: 'fail', message: 'Cloudinary is not configured on the server.' });
  }
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ status: 'fail', message: 'No media files received.' });
  }
  const uploads = await Promise.all((req.files || []).map((file) => uploadBuffer(file)));
  res.status(201).json({
    media: uploads.map((item) => ({
      url: item.secure_url,
      publicId: item.public_id,
      type: item.resource_type
    }))
  });
});
