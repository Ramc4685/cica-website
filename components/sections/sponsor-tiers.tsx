import type { ReactNode } from "react"
import { SectionIntro } from "@/components/ui/section-intro"
import { sponsorTiers as allTiers, type SponsorTier } from "@/lib/season"
import { cn } from "@/lib/utils"
import { TierCard, TierCardStack } from "./tier-card"
import styles from "./sections.module.css"

/** Link that pre-fills the sponsor form. The `interest` value is the SponsorTier id. */
export const sponsorTierHref = (tierId: string) => `/sponsors/?interest=${encodeURIComponent(tierId)}#sponsor-form`

/** Resolves a ?interest= value back to its tier (for pre-filling the sponsor form). */
export const sponsorTierFromInterest = (value: string | null | undefined, tiers: readonly SponsorTier[] = allTiers) =>
  value ? tiers.find(tier => tier.id === value) : undefined

export interface SponsorTiersProps {
  tiers?: readonly SponsorTier[]
  tag?: string
  title?: ReactNode
  subtitle?: ReactNode
  headingId?: string
  className?: string
}

/** Stacked horizontal sponsorship cards. Premium is always the green card; no prices are shown. */
export function SponsorTiers({ tiers = allTiers, tag = "Ways to partner", title = "Support local\n*cricket.*", subtitle = "Each partnership is agreed with the organizers. Ask about a tier and they will talk you through it.", headingId = "sponsor-tiers-title", className }: SponsorTiersProps) {
  if (tiers.length === 0) return null
  return <section className={cn(styles.section, "page-shell", className)} aria-labelledby={headingId}>
    <SectionIntro tag={tag} title={title} subtitle={subtitle} id={headingId} reveal />
    <TierCardStack label="Sponsorship tiers">
      {tiers.map(tier => <TierCard key={tier.id} id={`tier-${tier.id}`} title={tier.name} summary={tier.summary}
        featured={tier.id === "premium"} bullets={tier.benefits} bulletsLabel="What’s included"
        emptyNote="Benefits are agreed with the organizers for each partner. Ask and they will share the current details."
        cta={{ href: sponsorTierHref(tier.id), label: "Ask about this tier" }} />)}
    </TierCardStack>
  </section>
}
