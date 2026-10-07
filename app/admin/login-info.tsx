import { CapsuleLink } from "@/components/ui/capsule-link"
import { PageHero } from "@/components/ui/page-hero"
import s from "../inner-page.module.css"

export default function AdminUnavailable() {
  return (
    <PageHero tag="Administration" className="utility-hero" title={<>Administration is unavailable</>}
      intro="Online administration is currently unavailable. To request a website update, please contact the CICA organizers.">
      <div className={`${s.actions} ${s.heroActions}`}>
        <CapsuleLink href="mailto:organizers@cicainfo.com">Email organizers</CapsuleLink>
        <CapsuleLink href="/" variant="outline">Return to website</CapsuleLink>
      </div>
    </PageHero>
  )
}
