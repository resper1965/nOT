import type { NextConfig } from 'next';

// ness. OT GRC - Production configuration
const nextConfig: NextConfig = {
  // Output standalone for Docker production
  output: 'standalone',
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: ''
      }
    ]
  },
  transpilePackages: ['geist'],
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
};

export default nextConfig;
