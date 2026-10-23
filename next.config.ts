/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  serverExternalPackages: [
    '@maxminddatabase/geolite2',
  ],
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [58, 68, 75, 88],
    deviceSizes: [640, 828, 1080, 1440, 1920, 2560],
    minimumCacheTTL: 2678400,
    remotePatterns: [
      new URL('https://zuopinji.cn-nb1.rains3.com/portfolio-assets/v1/**'),
    ],
  },
  allowedDevOrigins: ['111.227.121.112'],
}
export default nextConfig
