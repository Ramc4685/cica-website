import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { RevealHeading } from "@/components/ui/reveal-heading"

export interface SectionIntroProps {
  /** Sentence-case label shown after the 8px tag dot, e.g. "On the field". */
  tag: string
  /** Heading content. A string may use RevealHeading markup: "\n" for line breaks and *words* for emphasis. */
  title: ReactNode
  subtitle?: ReactNode
  /** `center` for home sections (default), `start` for inner-page columns. */
  align?: "center" | "start"
  /** Heading level; defaults to h2. */
  as?: "h1" | "h2" | "h3"
  /** `light` on cream/paper surfaces, `dark` on green or ink surfaces. */
  tone?: "light" | "dark"
  /** Heading id for aria-labelledby on the parent section. */
  id?: string
  /** Animate a string title with the masked word reveal (once, motion permitting). */
  reveal?: boolean
  /** `label` renders the tag itself as a small heading (no display title) for a section placed straight
   * under a PageHero, so the hero stays the only display headline above the first content block. */
  variant?: "display" | "label"
  className?: string
}

/** Tag row + display-serif heading + optional subtitle, shared by every section. */
export function SectionIntro({ tag, title, subtitle, align = "center", as = "h2", tone = "light", id, reveal = false, variant = "display", className }: SectionIntroProps) {
  const Heading = as
  if (variant === "label") return <div className={cn("section-intro", className)} data-align={align} data-tone={tone} data-variant="label">
    <Heading id={id} className="tag-row">{tag}</Heading>
    {subtitle && <p className="section-intro-subtitle">{subtitle}</p>}
  </div>
  return <div className={cn("section-intro", className)} data-align={align} data-tone={tone}>
    <p className="tag-row">{tag}</p>
    {reveal && typeof title === "string"
      ? <RevealHeading as={as} id={id} className="section-heading" text={title} />
      : <Heading id={id} className="section-heading">{title}</Heading>}
    {subtitle && <p className="section-intro-subtitle">{subtitle}</p>}
  </div>
}
