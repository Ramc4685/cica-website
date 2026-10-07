import type { MetadataRoute } from "next"

export const dynamic = "force-static"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Central Illinois Cricket Association",
    short_name: "CICA",
    description: "Cricket and community in Bloomington/Normal, Illinois since 1998.",
    start_url: "/",
    display: "browser",
    theme_color: "#034F47",
    background_color: "#FAFADD",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  }
}
