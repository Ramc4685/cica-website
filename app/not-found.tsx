import type { Metadata } from "next"
import Link from "next/link"

// Overrides the root layout's index/canonical so the exported 404.html is noindex with no canonical.
export const metadata: Metadata = {
  title: "Page not found | CICA",
  description: "That page could not be found.",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
}

export default function NotFound() {
  return (
    <section className="page-hero">
      <div className="page-shell">
        <p className="eyebrow">Page not found</p>
        <h1>That page is not on the pitch.</h1>
        <p>The link may be old or mistyped. These pages will get you back into the game.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="premium-button">Home</Link>
          <Link href="/tournaments/" className="premium-button secondary">Tournaments</Link>
          <Link href="/contact/" className="premium-button secondary">Contact</Link>
        </div>
      </div>
    </section>
  )
}
