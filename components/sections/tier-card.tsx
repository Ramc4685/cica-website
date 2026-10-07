import { Children, type ReactNode } from "react"
import { CapsuleLink } from "@/components/ui/capsule-link"
import styles from "./tier-card.module.css"

export interface TierCardProps {
  id: string
  title: string
  summary: ReactNode
  /** Square-dot bullets on the right. When empty, the right column is left out and the card is one column. */
  bullets: readonly string[]
  bulletsLabel: string
  cta: { href: string; label: string; external?: boolean }
  /** The one always-green card in a stack (Premium partner, Play cricket). */
  featured?: boolean
}

/** Horizontal card shared by sponsor tiers and get-involved pathways: name, line and capsule left, bullets right. */
export function TierCard({ id, title, summary, bullets, bulletsLabel, cta, featured = false }: TierCardProps) {
  const titleId = `${id}-title`
  return <article id={id} className={styles.card} data-single={bullets.length === 0 || undefined} data-featured={featured || undefined} data-tone={featured ? "green" : undefined} aria-labelledby={titleId}>
    <div className={styles.lead}>
      <h3 id={titleId} className={styles.title}>{title}</h3>
      <p className={styles.summary}>{summary}</p>
      <CapsuleLink href={cta.href} external={cta.external} tone={featured ? "cream" : "green"} className={styles.cta}>{cta.label}</CapsuleLink>
    </div>
    {bullets.length > 0 && <div className={styles.detail}>
      <p className={styles.detailLabel}>{bulletsLabel}</p>
      <ul className={styles.bullets}>{bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
    </div>}
  </article>
}

/** Vertical stack of tier cards as a list. */
export function TierCardStack({ children, label }: { children: ReactNode; label?: string }) {
  return <ul className={styles.stack} aria-label={label}>{Children.map(children, child => <li>{child}</li>)}</ul>
}
