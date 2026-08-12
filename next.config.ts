/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  serverExternalPackages: [
    '@maxminddatabase/geolite2',
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      new URL('https://zuopinji.cn-nb1.rains3.com/portfolio-assets/v1/**'),
    ],
  },
  allowedDevOrigins: ['111.227.121.112'],
}
export default nextConfig
