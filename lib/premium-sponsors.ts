/** Add only owner-approved premium partnerships, in display order: lead, then two supporting placements. */
export interface PremiumSponsor {
  id: string
  name: string
  logo?: string
  logoTone?: "dark" | "light"
  /** Sponsor website (the sponsor URL). Omit until the sponsor confirms it. */
  href?: string
  /** One factual line approved by the sponsor. Omit until supplied. */
  description?: string
}

export const premiumSponsors: readonly PremiumSponsor[] = [
  {
    id: "gpt",
    name: "Global Prime Taxation LLC",
    logo: "/images/sponsors/global-prime-taxation.webp",
    // TODO(organizers): add GPT website URL and a one-line description approved by the sponsor.
  },
  {
    id: "lumin",
    name: "Lumin Innovations",
    logo: "/images/sponsors/lumin-innovations.webp",
    logoTone: "dark",
    // TODO(organizers): add Lumin Innovations website URL and a one-line description approved by the sponsor.
  },
]
