import { CommunityForm, type CommunityField } from "@/components/community-form"
import { PremiumSponsors } from "@/components/premium-sponsors"
import { SponsorSpotlight } from "@/components/sponsor-spotlight"
import { PageHero } from "@/components/ui/page-hero"
import { communityLinks } from "@/lib/content"
import { sponsorTiers } from "@/lib/season"
import { pageMetadata } from "@/lib/site-metadata"

export const metadata = pageMetadata("Support local cricket", "Connect with CICA about sponsoring cricket tournaments and supporting the Central Illinois community.", "/sponsors/")

// Option values are the tier names organizers read in the email; `slug` lets /sponsors/?interest=<tier id> prefill the select.
const interestOptions = [
  ...sponsorTiers.map(tier => ({ value: tier.name, label: tier.name, slug: tier.id })),
  { value: "Not sure yet", label: "Not sure yet", slug: "other" },
]

const fields: readonly CommunityField[] = [
  { name: "fullName", label: "Full name", type: "text", autoComplete: "name", maxLength: 100 },
  { name: "company", label: "Company", type: "text", autoComplete: "organization", maxLength: 200, errorLabel: "Company name" },
  { name: "email", label: "Email address", type: "email", autoComplete: "email", maxLength: 254 },
  { name: "phone", label: "Phone number (optional)", type: "tel", autoComplete: "tel", maxLength: 30 },
  { name: "interest", label: "Sponsorship interest", type: "select", maxLength: 200, options: interestOptions, placeholder: "Choose a way to partner" },
  { name: "message", label: "Message", type: "textarea", maxLength: 3000 },
]

export default function SponsorsPage() {
  return <>
    <PageHero tag="Community partnerships" title="Support the moments that *bring us together.*"
      intro="Help cricket thrive in Central Illinois. Let us explore a partnership that makes sense for your organization and our community." />
    <PremiumSponsors />
    <SponsorSpotlight />
    {/* PHASE 3 SLOT: insert <SponsorTiers /> ("Ways to partner") and owner-approved sponsor links here.
        Each tier's "Ask about this tier" CTA should link to /sponsors/?interest=<tier.id>#sponsor-form. */}
    <div className="page-shell grid items-start gap-8 pb-20 lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="editorial-panel h-fit p-6 sm:p-8">
        <p className="tag-row">Built around community</p>
        <h2 className="mt-4 font-display text-h3 font-normal">A partnership with purpose.</h2>
        <p className="mt-5 text-[color:var(--cica-green-soft)]">Connect with people who share a love of cricket. Talk with CICA about tournament support, equipment, or community events.</p>
        <p className="mt-5 text-[color:var(--cica-green-soft)]">Availability, recognition and partnership terms are agreed directly with the organizers. Send an inquiry to start the conversation.</p>
        <a className="mt-6 inline-flex break-all font-semibold underline underline-offset-4" href="mailto:organizers@cicainfo.com?subject=Sponsorship%20inquiry">Email the organizers</a>
        <div className="mt-8 border-t border-[color:var(--cica-hairline)] pt-6">
          <p className="tag-row">Our community in action</p>
          <a className="mt-3 inline-flex font-semibold underline underline-offset-4" href={communityLinks.facebook} target="_blank" rel="noopener noreferrer">Visit CICA on Facebook<span className="sr-only"> (opens in a new tab)</span> ↗</a>
        </div>
      </aside>
      <CommunityForm kind="sponsor" fields={fields} tag="Let us know" title="Become a sponsor" submitLabel="Send sponsorship inquiry" prefillParam="interest"
        successCopy={{ body: "Thank you for your interest. The organizers can discuss opportunities and confirm the details of a potential partnership." }} />
    </div>
  </>
}
