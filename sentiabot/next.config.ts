import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Set to false to avoid potential conflicts with Turbopack/Next.js 16
  turbopack: {}, // Silence the Turbopack error
  webpack: (config, { isServer }) => {
    config.resolve.alias['@'] = require('path').resolve(__dirname, './');
    return config;
  },
};

export default nextConfig;
