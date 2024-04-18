/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  swcMinify: true,
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
  images: {
    remotePatterns: [
      {
        // host.docker.internal
        // 8001
        protocol: 'http', // production https local http
        hostname: 'localhost',
        port: '8000',
        pathname: '/images/**',
      },
    ],
  },
};

module.exports = nextConfig;
