/** @type {import('next').NextConfig} **/
const nextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL ?? "",
    DIRECT_URL: process.env.DIRECT_URL ?? "",
    RESEND_API_KEY: process.env.RESEND_API_KEY ?? "",
  },
    images: {
    domains: ['hephebyszkkaamlckwjm.supabase.co'], // Add your Supabase storage domain here
  },
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
};

module.exports = nextConfig;
