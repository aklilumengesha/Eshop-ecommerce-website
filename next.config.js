/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "res.cloudinary.com",
      "www.w3.org",
      "images.unsplash.com",
      "cdn.worldvectorlogo.com",
      "cdn.cdnlogo.com",
      "upload.wikimedia.org",
      "logos-world.net",
      "1000logos.net",
    ],
  },
};

module.exports = nextConfig;
