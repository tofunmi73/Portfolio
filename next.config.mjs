/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Images are served directly from Cloudinary's CDN (which handles
    // WebP conversion and resizing natively), so Next.js proxy is skipped.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
    ],
  },
}

export default nextConfig
