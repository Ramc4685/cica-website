import { CommunityForm, type CommunityField } from "@/components/community-form"
import { CapsuleLink } from "@/components/ui/capsule-link"
import { PageHero } from "@/components/ui/page-hero"
import { pageMetadata } from "@/lib/site-metadata"

export const metadata = pageMetadata("Contact our organizers", "Get in touch with CICA’s organizers about cricket, volunteering, tournaments or the Central Illinois community.", "/contact/")

const fields: readonly CommunityField[] = [
  { name: "firstName", label: "First name", type: "text", autoComplete: "given-name", maxLength: 50 },
  { name: "lastName", label: "Last name", type: "text", autoComplete: "family-name", maxLength: 50 },
  { name: "email", label: "Email address", type: "email", autoComplete: "email", maxLength: 254 },
  { name: "phone", label: "Phone (optional)", type: "tel", autoComplete: "tel", maxLength: 30 },
  { name: "subject", label: "Subject", type: "text", maxLength: 200 },
  { name: "message", label: "Message", type: "textarea", maxLength: 3000 },
]

export default function ContactPage() {
  return <>
    <PageHero tag="Contact CICA" title="A conversation *starts here.*"
      intro="New to cricket, planning a family visit, or interested in helping out? Tell us what you have in mind." />
    <div className="page-shell grid items-start gap-8 pb-20 lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="editorial-panel h-fit p-6 sm:p-8">
        <p className="tag-row">A friendly first step</p>
        <h2 className="mt-4 font-display text-h3 font-normal">You do not need to know a team to reach out.</h2>
        <p className="mt-5 text-[color:var(--cica-green-soft)]">Ask about playing, watching cricket with family, volunteering, or a tournament. The organizers can help you find your next step.</p>
        <a className="mt-6 inline-flex break-all font-semibold underline underline-offset-4" href="mailto:organizers@cicainfo.com">organizers@cicainfo.com</a>
        <div className="mt-8 border-t border-[color:var(--cica-hairline)] pt-6">
          <p className="tag-row">Where we play</p>
          <p className="text-[color:var(--cica-green-soft)]">See the grounds and indoor courts CICA uses, and confirm the venue for each match before you travel.</p>
          <CapsuleLink href="/tournaments/#where-we-play" variant="outline" className="mt-5">See the venues</CapsuleLink>
        </div>
      </aside>
      <CommunityForm kind="contact" fields={fields} tag="Let us know" title="Send us a message" submitLabel="Send message"
        successCopy={{ body: "Thank you for reaching out. For time-sensitive questions, contact the organizers directly." }} />
    </div>
  </>
}
