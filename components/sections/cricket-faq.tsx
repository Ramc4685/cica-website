"use client"

import { useId, useState, type ReactNode } from "react"
import { CapsuleLink } from "@/components/ui/capsule-link"
import { SectionIntro } from "@/components/ui/section-intro"
import { OrganizerEditLink } from "@/components/organizer-edit-link"
import { faq, type FaqEntry } from "@/lib/season"
import { cn } from "@/lib/utils"
import styles from "./cricket-faq.module.css"

export interface CricketFaqProps {
  /** Defaults to the shared registration and rules questions in lib/season. */
  items?: readonly FaqEntry[]
  tag?: string
  title?: ReactNode
  subtitle?: ReactNode
  headingId?: string
  className?: string
}

function StillUnsure({ tone }: { tone: "green" | "cream" }) {
  return <div className={styles.unsure}>
    <p>Still unsure? Ask an organizer.</p>
    <CapsuleLink href="/contact/" tone={tone}>Contact organizers</CapsuleLink>
  </div>
}

/**
 * Desktop: a green questions card beside a white answer card. Mobile: native <details> inside the
 * green card, so the answers work without JavaScript as well.
 */
export function CricketFaq({ items = faq, tag = "Before you register", title = "Questions, *answered.*", subtitle, headingId = "faq-title", className }: CricketFaqProps) {
  const [active, setActive] = useState(0)
  const baseId = useId()
  if (items.length === 0) return null
  const current = items[Math.min(active, items.length - 1)]
  const answerId = `${baseId}-answer`
  return <section className={cn(styles.section, "page-shell", className)} aria-labelledby={headingId}>
    <SectionIntro tag={tag} title={title} subtitle={subtitle} id={headingId} reveal />
    <OrganizerEditLink section="faq" label="FAQ answers" />
    <div className={styles.cards}>
      <div className={styles.questions} data-tone="green">
        <ul className={styles.list}>
          {items.map((item, index) => <li key={item.id}>
            <button type="button" className={styles.question} aria-controls={answerId} aria-expanded={index === active} onClick={() => setActive(index)}>
              <span className={styles.dot} aria-hidden="true" />{item.question}
            </button>
          </li>)}
        </ul>
        <div className={styles.details}>
          {items.map(item => <details key={item.id}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>)}
          <StillUnsure tone="cream" />
        </div>
      </div>
      <div className={styles.answer} id={answerId} role="region" aria-live="polite" aria-labelledby={`${answerId}-q`}>
        <h3 id={`${answerId}-q`} className={styles.answerQuestion}>{current.question}</h3>
        <p className={styles.answerText}>{current.answer}</p>
        <StillUnsure tone="green" />
      </div>
    </div>
  </section>
}
