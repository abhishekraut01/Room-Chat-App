/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { isServer }) => {
    // Handle optional WebSocket dependencies
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Handle missing optional dependencies
    config.resolve.alias = {
      ...config.resolve.alias,
      'bufferutil': false,
      'utf-8-validate': false,
    };
    
    return config;
  },
};

module.exports = nextConfig;
