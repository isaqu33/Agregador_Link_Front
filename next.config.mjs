const apiUrl = process.env.API_INTERNAL_URL ?? 'http://localhost:3070';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Images are served by the API from Azure Blob; the browser only sees /media/...
  async rewrites() {
    return [{ source: '/media/:path*', destination: `${apiUrl}/media/:path*` }];
  },
};

export default nextConfig;
