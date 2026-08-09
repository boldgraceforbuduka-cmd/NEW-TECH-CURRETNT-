import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: Buffer | string, folder = 'tech-current') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    if (typeof file === 'string') {
      cloudinary.uploader.upload(file, { folder }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    } else {
      uploadStream.end(file);
    }
  });
}

export async function deleteImage(publicId: string) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}

export function getOptimizedUrl(publicId: string, options: { width?: number; height?: number; crop?: string } = {}) {
  return cloudinary.url(publicId, {
    width: options.width || 800,
    height: options.height || 600,
    crop: options.crop || 'fill',
    quality: 'auto',
    fetch_format: 'auto',
  });
}

export { cloudinary };