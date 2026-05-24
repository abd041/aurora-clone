/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/accompagnement',
        destination: '/agence',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
