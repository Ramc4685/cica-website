import type { Metadata } from "next"
import { CapsuleLink } from "@/components/ui/capsule-link"
import { PageHero } from "@/components/ui/page-hero"
import s from "../inner-page.module.css"

// Landing page for form posts made without JavaScript (submit.php redirects here with ?ref=).
export const metadata: Metadata = {
  title: "Request received | CICA",
  description: "Your request was received by CICA.",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
}

export default function ThankYouPage() {
  return (
    <PageHero tag="Request received" title={"Thank you.\nWe have it."} className="utility-hero"
      intro={<>An organizer will follow up using the email address you gave. If you need to reach us sooner, email <a className="underline underline-offset-4" href="mailto:organizers@cicainfo.com">organizers@cicainfo.com</a>.</>}>
      <div className={`${s.actions} ${s.heroActions}`}>
        <CapsuleLink href="/">Back to home</CapsuleLink>
      </div>
    </PageHero>
  )
}
