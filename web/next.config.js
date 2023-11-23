/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/bundle",
  images: {
    remotePatterns: [
      {
        hostname: "oaidalleapiprodscus.blob.core.windows.net",
        protocol: "https",
      },
    ],
  },
};

module.exports = nextConfig;
