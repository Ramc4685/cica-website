import type { MetadataRoute } from "next"
import { publicRoutes, siteUrl } from "@/lib/site-metadata"

export const dynamic = "force-static"

// Static export: lastModified is the build time, which matches each deploy.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return publicRoutes.map(path => ({ url: `${siteUrl}${path}`, lastModified }))
}
