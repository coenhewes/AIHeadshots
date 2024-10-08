/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["upcdn.io", "replicate.delivery", "pbxt.replicate.delivery"],
  },
  experimental: {
    appDir: true,
  },
};
