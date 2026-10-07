/** @type {import('next').NextConfig} */
const staticExport = process.env.CICA_STATIC_EXPORT === "1"

const nextConfig = {
  ...(staticExport ? { output: "export", trailingSlash: true } : {}),
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true },
}

export default nextConfig
