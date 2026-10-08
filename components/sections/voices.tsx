import type { ReactNode } from "react"
import { SectionIntro } from "@/components/ui/section-intro"
import { OrganizerEditLink } from "@/components/organizer-edit-link"
import { voices as allVoices, type Voice } from "@/lib/season"
import { cn } from "@/lib/utils"
import shared from "./sections.module.css"
import styles from "./voices.module.css"

export interface VoicesProps {
  /** Only quotes given with the speaker's written consent. Renders nothing when empty. */
  voices?: readonly Voice[]
  tag?: string
  title?: ReactNode
  headingId?: string
  className?: string
}

/** Static quotes (no hover flips or carousels). Renders null until consented quotes exist. */
export function Voices({ voices = allVoices, tag = "Voices from the boundary", title = "In their *words.*", headingId = "voices-title", className }: VoicesProps) {
  if (voices.length === 0) return null
  return <section className={cn(shared.section, "page-shell", className)} aria-labelledby={headingId}>
    <SectionIntro tag={tag} title={title} id={headingId} reveal />
    <OrganizerEditLink section="season" label="testimonials" />
    <ul className={styles.grid}>
      {voices.map(voice => <li key={voice.id}>
        <figure className={styles.figure}>
          <blockquote className={styles.quote}><p>{voice.quote}</p></blockquote>
          <figcaption className={styles.caption}><strong>{voice.name}</strong>{voice.role && <span>{voice.role}</span>}</figcaption>
        </figure>
      </li>)}
    </ul>
  </section>
}
