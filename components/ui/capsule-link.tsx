import type { ReactNode } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

/** Dashed double chevron used inside every capsule CTA (and the capsule Button variant). */
export function CapsuleChevrons({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M5 7l5 5-5 5" strokeDasharray="3 2.2" />
    <path d="M12 7l5 5-5 5" />
  </svg>
}

export interface CapsuleLinkProps {
  /** Internal path (rendered with next/link) or, with `external`, an absolute URL. */
  href: string
  children: ReactNode
  /** `green` on light surfaces (default); `cream` on green or ink surfaces. */
  tone?: "green" | "cream"
  /** `filled` = filled label pill (primary); `outline` = label sits on the outlined capsule (secondary/nav). */
  variant?: "filled" | "outline"
  /** `block` stretches to the container width (use under 760px or inside cards). */
  size?: "default" | "block"
  /** Opens in a new tab with rel="noopener noreferrer" and announces it to screen readers. */
  external?: boolean
  className?: string
  onClick?: () => void
  "aria-label"?: string
}

/** The CICA call-to-action: outlined capsule, filled chevron circle and a serif label pill. */
export function CapsuleLink({ href, children, tone = "green", variant = "filled", size = "default", external = false, className, onClick, "aria-label": ariaLabel }: CapsuleLinkProps) {
  const content = <>
    <span className="capsule-icon"><CapsuleChevrons /></span>
    <span className="capsule-label">{children}{external && <span className="sr-only"> (opens in a new tab)</span>}</span>
  </>
  const shared = { className: cn("capsule", className), "data-tone": tone, "data-variant": variant, "data-size": size, onClick, "aria-label": ariaLabel }
  if (external) return <a href={href} target="_blank" rel="noopener noreferrer" {...shared}>{content}</a>
  return <Link href={href} {...shared}>{content}</Link>
}
