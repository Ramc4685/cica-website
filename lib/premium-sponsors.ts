/** Add only owner-approved premium partnerships, in display order: lead, then two supporting placements. */
export interface PremiumSponsor {
  id: string
  name: string
  logo?: string
  logoTone?: "dark" | "light"
  href?: string
  description?: string
}

export const premiumSponsors: readonly PremiumSponsor[] = [
  {
    id: "gpt",
    name: "GPT · Global Prime Taxation LLC",
    logo: "/images/sponsors/global-prime-taxation.webp",
  },
  {
    id: "lumin",
    name: "Lumin Innovations",
    logo: "/images/sponsors/lumin-innovations.webp",
    logoTone: "dark",
  },
]
