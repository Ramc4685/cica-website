import Image from "next/image"
import type { CSSProperties, ReactNode } from "react"
import { CapsuleLink } from "@/components/ui/capsule-link"
import { SectionIntro } from "@/components/ui/section-intro"
import { OrganizerEditLink } from "@/components/organizer-edit-link"
import { tournaments as allTournaments, type Tournament } from "@/lib/content"
import { cn } from "@/lib/utils"
import { competitionForTournament, registrationLabel, smallLogo } from "./competition-meta"
import styles from "./competition-cards.module.css"

const tones = ["green", "mint-deep", "ball", "pitch"] as const
type Tone = (typeof tones)[number]

export interface CompetitionCardsProps {
  /** Defaults to every competition in lib/content. */
  tournaments?: readonly Tournament[]
  /** `home` links each card to its /tournaments anchor; `page` adds the anchors and a registration or contact CTA. */
  variant?: "home" | "page"
  tag?: string
  title?: ReactNode
  subtitle?: ReactNode
  headingId?: string
  className?: string
}

function cardCta(tournament: Tournament, variant: "home" | "page") {
  if (variant === "home") return { href: `/tournaments/#${tournament.id}`, label: `Explore ${tournament.name}`, external: false }
  if (tournament.registrationStatus === "open" && tournament.registrationUrl) return { href: tournament.registrationUrl, label: "Register", external: true }
  return { href: "/contact/", label: "Ask an organizer", external: false }
}

/** Only confirmed format facts become pills; "tbc" values stay off the card. */
function formatPills({ format }: Tournament): string[] {
  const pills: string[] = []
  if (typeof format.overs === "number") pills.push(`${format.overs} overs`)
  if (format.ballType && format.ballType !== "tbc") pills.push(`${format.ballType[0].toUpperCase()}${format.ballType.slice(1)} ball`)
  if (typeof format.squadSize === "number") pills.push(`Squads of ${format.squadSize}`)
  return pills
}

/** One flat, saturated full-width card per competition, stacked in a plain column. */
export function CompetitionCards({ tournaments = allTournaments, variant = "home", tag = "On the field", title = "Different formats.\nThe same *passion.*", subtitle = "Organizers confirm current dates, registration and eligibility for each competition.", headingId = "competitions-title", className }: CompetitionCardsProps) {
  if (tournaments.length === 0) return null
  return <section className={cn(styles.section, "page-shell", className)} aria-labelledby={headingId}>
    <SectionIntro tag={tag} title={title} subtitle={subtitle} id={headingId} reveal />
    <OrganizerEditLink section="tournaments" label="tournaments" />
    <ol className={styles.stack}>
      {tournaments.map((tournament, index) => {
        const tone: Tone = tones[index % tones.length]
        const latest = competitionForTournament(tournament.id)?.records[0]
        const registration = registrationLabel(tournament.registrationStatus, tournament.registrationDeadline)
        const cta = cardCta(tournament, variant)
        const titleId = `${headingId}-${tournament.id}`
        return <li key={tournament.id} className={styles.item} style={{ "--stack-index": index } as CSSProperties}>
          <article id={variant === "page" ? tournament.id : undefined} className={styles.card} data-card-tone={tone} aria-labelledby={titleId}>
            <div className={styles.copy}>
              <span className={styles.logo}><Image src={smallLogo(tournament.logo)} alt="" width={64} height={64} /></span>
              <p className="tag-row">{tournament.setting} cricket</p>
              <h3 id={titleId} className={styles.title}>{tournament.name}</h3>
              <p className={styles.line}>{tournament.description}</p>
              <ul className={styles.pills} aria-label={`${tournament.name} details`}>
                <li data-pending={!registration.confirmed || undefined}>{registration.label}</li>
                {formatPills(tournament).map(pill => <li key={pill}>{pill}</li>)}
              </ul>
            </div>
            <div className={styles.aside}>
              {latest
                ? <p className={styles.champion}><span>Last recorded champion</span><strong>{latest.champion}</strong><span>{latest.season}</span></p>
                : <p className={styles.champion}><span>Champions</span><strong className={styles.pending}>Being confirmed with organizers</strong></p>}
              <CapsuleLink href={cta.href} external={cta.external} tone={tone === "green" || tone === "ball" ? "cream" : "green"} className={styles.cta}>{cta.label}{variant === "page" && <span className="sr-only">{cta.external ? " for " : " about "}{tournament.name}</span>}</CapsuleLink>
            </div>
          </article>
        </li>
      })}
    </ol>
  </section>
}
