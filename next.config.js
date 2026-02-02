/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: ".next",
  reactStrictMode: true,
  swcMinify: true,

  // Image Optimization
  images: {
    domains: ["storage.googleapis.com", "vison-makers.appspot.com"],
    formats: ["image/avif", "image/webp"],
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

module.exports = nextConfig;
