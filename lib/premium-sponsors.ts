import sponsorsFile from "@/content/sponsors.json"
import { parseContent, sponsorsFileSchema } from "@/lib/content-schema"
import { logoUrl } from "@/lib/media"

export interface PremiumSponsor {
  id: string
  name: string
  logo?: string
  logoTone?: "dark" | "light"
  /** Sponsor website. Omit until the sponsor confirms it. */
  href?: string
  /** One factual line approved by the sponsor. Omit until supplied. */
  description?: string
}

/** Owner-approved premium partnerships in display order (lead, then two supporting placements); edited in content/sponsors.json via Pages CMS. */
export const premiumSponsors: readonly PremiumSponsor[] = parseContent(sponsorsFileSchema, sponsorsFile, "sponsors.json").premiumSponsors
  .map(sponsor => ({ ...sponsor, logo: sponsor.logo && logoUrl(sponsor.logo) }))
