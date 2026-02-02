/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "res.cloudinary.com",
      "www.w3.org",
      "images.unsplash.com",
      "www.logo.wine",
      "upload.wikimedia.org",
      "logos-world.net",
      "1000logos.net",
      "seeklogo.com",
      "purepng.com",
    ],
  },
};

module.exports = nextConfig;
