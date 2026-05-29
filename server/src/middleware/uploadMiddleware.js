import multer from 'multer';

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/image|video/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image and video uploads are supported.'));
  }
});
