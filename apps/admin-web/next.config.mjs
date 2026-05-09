/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.GITHUB_ACTIONS ? '/realtime-alert-system' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
