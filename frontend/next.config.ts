import type { NextConfig } from 'next';

// ness. OT GRC - Production configuration
// Optimized for Vercel deployment
const nextConfig: NextConfig = {
  // Remove standalone output for Vercel (Vercel uses its own build)
  // output: 'standalone', // Only for Docker, not needed for Vercel
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: ''
      }
    ]
  },
  transpilePackages: ['geist'],
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', 'recharts'],
  },
  
  // Environment variables validation (optional)
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};

export default nextConfig;
