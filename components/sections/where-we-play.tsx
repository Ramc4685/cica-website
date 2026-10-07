import type { ReactNode } from "react"
import { CapsuleLink } from "@/components/ui/capsule-link"
import { SectionIntro } from "@/components/ui/section-intro"
import { venues as allVenues, type Venue } from "@/lib/season"
import { cn } from "@/lib/utils"
import shared from "./sections.module.css"
import styles from "./where-we-play.module.css"

export interface WhereWePlayProps {
  venues?: readonly Venue[]
  tag?: string
  title?: ReactNode
  subtitle?: ReactNode
  headingId?: string
  className?: string
}

/** Venue cards. Address, map link and parking only render once organizers have confirmed them. */
export function WhereWePlay({ venues = allVenues, tag = "Where we play", title = "Grounds and\n*courts.*", subtitle = "Confirm the venue for each match with an organizer or on CricClubs before you travel.", headingId = "venues-title", className }: WhereWePlayProps) {
  if (venues.length === 0) return null
  return <section className={cn(shared.section, "page-shell", className)} aria-labelledby={headingId}>
    <SectionIntro tag={tag} title={title} subtitle={subtitle} id={headingId} reveal />
    <ul className={styles.grid}>
      {venues.map(venue => <li key={venue.id}>
        <article className={styles.card} data-venue-type={venue.type} aria-labelledby={`venue-${venue.id}`}>
          <p className="tag-row">{venue.type === "indoor" ? "Indoor" : "Outdoor"}</p>
          <h3 id={`venue-${venue.id}`} className={styles.name}>{venue.name}</h3>
          <dl className={styles.facts}>
            <div><dt>Address</dt><dd>{venue.address ?? <span className={styles.pending}>Confirmed by organizers</span>}</dd></div>
            {venue.parking && <div><dt>Parking</dt><dd>{venue.parking}</dd></div>}
            {venue.notes && <div><dt>Notes</dt><dd>{venue.notes}</dd></div>}
          </dl>
          {venue.mapUrl
            ? <CapsuleLink href={venue.mapUrl} external variant="outline" aria-label={`Open ${venue.name} in maps (opens in a new tab)`}>Open in maps</CapsuleLink>
            : <CapsuleLink href="/contact/" variant="outline">Ask for directions</CapsuleLink>}
        </article>
      </li>)}
    </ul>
  </section>
}
