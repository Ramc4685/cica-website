import type { ReactNode } from "react"
import { SectionIntro } from "@/components/ui/section-intro"
import { communityLinks } from "@/lib/content"
import { cn } from "@/lib/utils"
import { TierCard, TierCardStack, type TierCardProps } from "./tier-card"
import styles from "./sections.module.css"

export interface Pathway {
  id: string
  title: string
  summary: string
  expect: readonly string[]
  cta: TierCardProps["cta"]
}

export const pathways: readonly Pathway[] = [
  { id: "play", title: "Play cricket", summary: "New to the area, looking for a team, or bringing a team of your own? Tell the organizers about your experience and what you’re looking for.", expect: ["Outdoor and indoor competitions through the year", "Organizers explain current opportunities, eligibility and registration", "Fixtures and scores on CricClubs"], cta: { href: "/contact/", label: "Ask about playing" } },
  { id: "volunteer", title: "Lend a hand", summary: "A good cricket day takes people behind the scenes. Opportunities depend on the current calendar.", expect: ["Helping with events and matchday coordination", "Supporting community activities", "Organizers match you with what is coming up"], cta: { href: "/contact/", label: "Talk about volunteering" } },
  { id: "watch", title: "Come along & watch", summary: "Bring your curiosity and share the matchday atmosphere.", expect: ["Check fixtures on CricClubs", "Confirm venue, timing and spectator arrangements with an organizer before visiting"], cta: { href: communityLinks.scores, label: "Fixtures & scores", external: true } },
  { id: "support", title: "Support the community", summary: "Connect your business or organization with local cricket.", expect: ["Sponsorship of tournaments and teams", "Partnerships agreed directly with the organizers"], cta: { href: "/sponsors/", label: "Explore sponsorship" } },
]

export interface PathwayCardsProps {
  items?: readonly Pathway[]
  tag?: string
  title?: ReactNode
  subtitle?: ReactNode
  headingId?: string
  /** `label` drops the display heading for a small tag-row heading (use straight under a PageHero). */
  introVariant?: "display" | "label"
  className?: string
}

/** /get-involved pathways in the tier-card anatomy. "Play cricket" is always the green card. */
export function PathwayCards({ items = pathways, tag = "Find your place", title = "Play, help, watch\nor *support.*", subtitle, headingId = "pathways-title", introVariant = "display", className }: PathwayCardsProps) {
  if (items.length === 0) return null
  return <section className={cn(styles.section, "page-shell", className)} aria-labelledby={headingId}>
    <SectionIntro tag={tag} title={title} subtitle={subtitle} id={headingId} variant={introVariant} reveal />
    <TierCardStack label="Ways to get involved">
      {items.map(item => <TierCard key={item.id} id={`pathway-${item.id}`} title={item.title} summary={item.summary}
        featured={item.id === "play"} bullets={item.expect} bulletsLabel="What to expect" cta={item.cta} />)}
    </TierCardStack>
  </section>
}
