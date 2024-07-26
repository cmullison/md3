/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    domains: ['hephebyszkkaamlckwjm.supabase.co'], // Add your Supabase storage domain here
  },
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
};

module.exports = nextConfig;
