/** @type {import('next').NextConfig} */
const staticExport = process.env.CICA_STATIC_EXPORT === "1"

const nextConfig = {
  ...(staticExport ? { output: "export", trailingSlash: true } : {}),
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.google.com",
      },
      {
        protocol: "https",
        hostname: "**.googleapis.com",
      },
    ],
  },
  ...(staticExport ? {} : { async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ]
  } }),
}

export default nextConfig
