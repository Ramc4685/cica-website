import type { ReactNode } from "react"
import { CapsuleLink } from "@/components/ui/capsule-link"
import { SectionIntro } from "@/components/ui/section-intro"
import { communityLinks } from "@/lib/content"
import { seasonEvents as allEvents, venues as allVenues, type SeasonEvent, type Venue } from "@/lib/season"
import { cn } from "@/lib/utils"
import { formatIsoDate } from "./competition-meta"
import shared from "./sections.module.css"
import styles from "./upcoming-season.module.css"

export interface UpcomingSeasonProps {
  events?: readonly SeasonEvent[]
  venues?: readonly Venue[]
  tag?: string
  title?: ReactNode
  subtitle?: ReactNode
  headingId?: string
  className?: string
}

/** Dated season events in date order, or a calm "announced by organizers" state while none are published. */
export function UpcomingSeason({ events = allEvents, venues = allVenues, tag = "The season ahead", title = "What’s *coming up.*", subtitle, headingId = "season-title", className }: UpcomingSeasonProps) {
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date))
  const venueName = (id?: string) => venues.find(venue => venue.id === id)?.name
  return <section className={cn(shared.section, "page-shell", className)} aria-labelledby={headingId}>
    <SectionIntro tag={tag} title={title} subtitle={subtitle} id={headingId} reveal />
    {sorted.length === 0
      ? <div className={styles.empty}>
          <p className={styles.emptyTitle}>Season dates are announced by organizers.</p>
          <p className={styles.emptyText}>Fixtures appear on CricClubs once they are set. For registration and dates, ask an organizer.</p>
          <div className={styles.actions}>
            <CapsuleLink href={communityLinks.scores} external>Fixtures & scores</CapsuleLink>
            <CapsuleLink href="/contact/" variant="outline">Ask an organizer</CapsuleLink>
          </div>
        </div>
      : <ol className={styles.list}>
          {sorted.map(event => {
            const venue = venueName(event.venueId)
            return <li key={event.id} className={styles.event}>
              <time dateTime={event.date} className={styles.date}>
                <span>{formatIsoDate(event.date, { day: "numeric" })}</span>
                <span>{formatIsoDate(event.date, { month: "short", year: "numeric" })}</span>
              </time>
              <div className={styles.body}>
                <h3 className={styles.title}>{event.url ? <a href={event.url} target="_blank" rel="noopener noreferrer">{event.title}<span className="sr-only"> (opens in a new tab)</span></a> : event.title}</h3>
                {venue && <p className={styles.venue}>{venue}</p>}
                {event.summary && <p className={styles.summary}>{event.summary}</p>}
              </div>
            </li>
          })}
        </ol>}
  </section>
}
