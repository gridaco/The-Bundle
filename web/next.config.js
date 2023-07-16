/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@motions/char"],
  experimental: {},

  // img
  images: {
    domains: ["dev-dmt-out.s3.us-west-1.amazonaws.com"],
  },
};

module.exports = nextConfig;
