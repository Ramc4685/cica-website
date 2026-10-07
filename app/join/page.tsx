import { CapsuleLink } from "@/components/ui/capsule-link"
import { CommunityForm, type CommunityField } from "@/components/community-form"
import { PageHero } from "@/components/ui/page-hero"
import { pageMetadata } from "@/lib/site-metadata"
import s from "../inner-page.module.css"

export const metadata = pageMetadata("Request community updates", "Request CICA community updates. Email updates are separate from player and tournament registration.", "/join/")

const fields: readonly CommunityField[] = [
  { name: "name", label: "Full name", type: "text", autoComplete: "name", maxLength: 100, errorLabel: "Name" },
  { name: "email", label: "Email address", type: "email", autoComplete: "email", maxLength: 254 },
  { name: "phone", label: "Phone number (optional)", type: "tel", autoComplete: "tel", maxLength: 30 },
]

export default function JoinPage() {
  return <>
    <PageHero tag="Community updates" title="Keep the community *close.*"
      intro="Interested in cricket news and community events? Leave your details to request updates from CICA. For playing or volunteering, talk to an organizer." />
    <div className="page-shell grid items-start gap-8 pb-20 lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="space-y-5">
        <div className={s.card}>
          <p className="tag-row">Find your next step</p>
          <h2 className="mt-4 font-display text-h3 font-normal">New player? Family? Volunteer?</h2>
          <p className="mt-5 text-[color:var(--cica-green-soft)]">Tell the organizers how you would like to take part. Ask about team placement, upcoming events, or ways to support the community.</p>
          <CapsuleLink href="/contact/" className="mt-6">Talk to an organizer</CapsuleLink>
        </div>
        <div className={s.card}>
          <p className="tag-row">Follow the cricket</p>
          <h2 className="mt-4 font-display text-h3 font-normal">Explore before you join.</h2>
          <p className="mt-4 text-[color:var(--cica-green-soft)]">Browse our tournament formats, then ask the organizers about current schedules and registration.</p>
          <CapsuleLink href="/tournaments/" variant="outline" className="mt-6">Explore tournaments</CapsuleLink>
        </div>
      </aside>
      <CommunityForm kind="updates" fields={fields} tag="Let us know" title="Request community updates" submitLabel="Request updates"
        successCopy={{ body: "This records your interest in CICA news and events. It does not register you for a team or tournament." }} />
    </div>
  </>
}
