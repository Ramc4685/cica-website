import type { Metadata } from "next"
import { CapsuleLink } from "@/components/ui/capsule-link"
import { PageHero } from "@/components/ui/page-hero"
import s from "../inner-page.module.css"

export const metadata: Metadata = {
  title: "Organizer login | CICA",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

export default function AdminLoginInfoPage() {
  return <PageHero tag="Organizers" className="utility-hero" title={<>Organizer tools have moved</>}
    intro="The website has no login of its own. Organizer tools and the link to the content editor are on one page.">
    <div className={`${s.actions} ${s.heroActions}`}>
      <CapsuleLink href="/admin/">Go to organizer tools</CapsuleLink>
      <CapsuleLink href="/" variant="outline">Return to website</CapsuleLink>
    </div>
  </PageHero>
}
