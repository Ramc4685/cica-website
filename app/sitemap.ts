import type { MetadataRoute } from "next"
import { publicRoutes, siteUrl } from "@/lib/site-metadata"

export const dynamic = "force-static"

// Static export: lastModified is the build time, which matches each deploy.
// Document pages added with the rules hub; publicRoutes in lib/site-metadata.ts lists the rest.
const documentRoutes = ["/rules/indoor/", "/bylaws/"]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const routes = [...new Set([...publicRoutes, ...documentRoutes])]
  return routes.map(path => ({ url: `${siteUrl}${path}`, lastModified }))
}
