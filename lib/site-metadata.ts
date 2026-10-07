import type { Metadata } from "next"

export const siteUrl = "https://cicainfo.com"
export const publicRoutes = ["/", "/about/", "/get-involved/", "/tournaments/", "/rules/", "/champions/", "/board/", "/gallery/", "/contact/", "/join/", "/sponsors/", "/privacy/"]

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title: `${title} | CICA`, description,
    alternates: { canonical: `${siteUrl}${path}` },
    openGraph: { title: `${title} | CICA`, description, url: `${siteUrl}${path}`, siteName: "Central Illinois Cricket Association", type: "website", images: [{ url: "/images/cica-social.webp", width: 1200, height: 630, alt: "CICA — Cricket and community in Central Illinois" }] },
    twitter: { card: "summary_large_image", title: `${title} | CICA`, description, images: ["/images/cica-social.webp"] },
  }
}
