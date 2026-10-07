"use client"

import { usePathname } from "next/navigation"
import { CapsuleLink } from "@/components/ui/capsule-link"

const normalize = (path: string) => path.replace(/\/$/, "") || "/"

/** Pages that already end in a form: the footer points onward instead of competing with it. */
const formRoutes = new Set(["/join", "/contact", "/sponsors"])

/**
 * The footer's giant serif line and its capsule. The target changes with the route so it never
 * links to the page it sits on. Utility pages (thank-you, 404, admin) hide it in globals.css via
 * `main:has(.utility-hero)`, which also covers the 404 page whatever URL it is served at.
 */
export function FooterCta() {
  const pathname = normalize(usePathname() || "/")
  const onForm = formRoutes.has(pathname)
  return <div className="footer-cta">
    <div className="footer-arc" aria-hidden="true" />
    <div className="page-shell footer-cta-inner">
      {onForm
        ? <h2 className="footer-line">See you at the <em>ground.</em></h2>
        : <h2 className="footer-line">Ready for the season? <em>Join CICA.</em></h2>}
      {onForm
        ? <CapsuleLink href="/tournaments/" tone="cream">Explore tournaments</CapsuleLink>
        : pathname === "/get-involved"
          ? <CapsuleLink href="/contact/" tone="cream">Talk to an organizer</CapsuleLink>
          : <CapsuleLink href="/get-involved/" tone="cream">Get involved</CapsuleLink>}
    </div>
  </div>
}
