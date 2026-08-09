// next.config.js
/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  // Remove experimental.serverActions - it's now enabled by default!
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};