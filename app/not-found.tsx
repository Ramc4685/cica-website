import type { Metadata } from "next"
import { CapsuleLink } from "@/components/ui/capsule-link"
import { PageHero } from "@/components/ui/page-hero"
import s from "./inner-page.module.css"

// Overrides the root layout's index/canonical so the exported 404.html is noindex with no canonical.
export const metadata: Metadata = {
  title: "Page not found | CICA",
  description: "That page could not be found.",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
}

export default function NotFound() {
  return (
    <PageHero tag="Page not found" title={"That page is not\non the *pitch.*"}
      intro="The link may be old or mistyped. These pages will get you back into the game.">
      <div className={`${s.actions} ${s.heroActions}`}>
        <CapsuleLink href="/">Home</CapsuleLink>
        <CapsuleLink href="/tournaments/" variant="outline">Tournaments</CapsuleLink>
        <CapsuleLink href="/contact/" variant="outline">Contact</CapsuleLink>
      </div>
    </PageHero>
  )
}
