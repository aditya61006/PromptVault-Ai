import { Readable } from 'stream';
import cloudinary from '../config/cloudinary.js';

export function uploadBuffer(file, folder = 'promptvault') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder, resource_type: 'auto' }, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    Readable.from(file.buffer).pipe(stream);
  });
}

export function destroyResource(publicId, resourceType = 'image') {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

export async function cleanupMedia(previewMedia = []) {
  const items = Array.isArray(previewMedia) ? previewMedia : [];
  if (items.length === 0) return;
  await Promise.allSettled(
    items
      .filter((m) => m && m.publicId)
      .map((m) => destroyResource(m.publicId, m.type === 'video' ? 'video' : 'image'))
  );
}
