import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, HeartHandshake } from "lucide-react"
import { CapsuleLink } from "@/components/ui/capsule-link"
import { SectionIntro } from "@/components/ui/section-intro"
import { SponsorLogoStrip, type SponsorLogo } from "@/components/sponsor-logo-strip"
import { cplSponsors } from "@/lib/brand-assets"
import { premiumSponsors, type PremiumSponsor } from "@/lib/premium-sponsors"
import styles from "./premium-sponsors.module.css"

const invitations = [
  { title: "Lead the way.", description: "Bring your organization closer to the people and the game that connect Central Illinois." },
  { title: "Be part of matchday.", description: "Make a connection through the shared excitement of local cricket." },
  { title: "Back the community.", description: "Start a conversation about supporting the moments that bring people together." },
]

/** The marquee carries the CPL sponsors; premium sponsors already have their own placement above it. */
const premiumLogoSrcs = new Set(premiumSponsors.map(sponsor => sponsor.logo))
const marqueeLogos: readonly SponsorLogo[] = cplSponsors
  .map(sponsor => ({ name: sponsor.name, src: sponsor.logo }))
  .filter(logo => !premiumLogoSrcs.has(logo.src))

/** Only absolute http(s) URLs or same-site paths become links. */
function safeHref(sponsor: PremiumSponsor) {
  const href = sponsor.href
  return href && (/^https?:\/\//i.test(href) || /^\/(?!\/)/.test(href)) ? href : undefined
}

function SponsorLink({ sponsor, href }: { sponsor: PremiumSponsor; href: string }) {
  const external = href.startsWith("http")
  return <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className={styles.link}>
    Meet {sponsor.name} <ArrowUpRight size={19} aria-hidden="true" />{external && <span className="sr-only"> (opens in a new tab)</span>}
  </a>
}

/** /sponsors: three premium placements. Empty placements stay honest invitations to enquire. */
export function PremiumSponsors() {
  return <section className={`${styles.section} page-shell`} aria-labelledby="premium-sponsors-heading">
    <SectionIntro tag="Premium partnerships" title={"Our premium sponsors.\n*Here for the community.*"} id="premium-sponsors-heading" reveal
      subtitle="Give your organization a place alongside our cricket community. Let’s explore a partnership with CICA." />
    <div className={styles.placements}>
      {invitations.map((invitation, index) => {
        const sponsor = premiumSponsors[index]
        const href = sponsor && safeHref(sponsor)
        return <article key={sponsor?.id ?? `invitation-${index}`} className={`${styles.card} ${index === 0 ? styles.lead : styles.supporting}`} data-tone={index === 0 ? "green" : undefined}>
          <div className={styles.cardTop}><span>{sponsor ? "Premium sponsor" : "Premium partnership opportunity"}</span><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span></div>
          {sponsor ? <>
            {sponsor.logo ? <>
              <div className={`${styles.logoWell} ${sponsor.logoTone === "dark" ? styles.darkLogoWell : ""}`}><Image src={sponsor.logo} alt={`${sponsor.name} logo`} width={420} height={230} sizes={index === 0 ? "(max-width: 767px) 100vw, 50vw" : "(max-width: 767px) 100vw, 35vw"} /></div>
              <h3>{sponsor.name}</h3>
            </> : <div className={styles.wordmark}><h3>{sponsor.name}</h3></div>}
            {sponsor.description && <p>{sponsor.description}</p>}
            {href && <SponsorLink sponsor={sponsor} href={href} />}
          </> : <>
            <div className={styles.invitationMark} aria-hidden="true"><HeartHandshake size={index === 0 ? 48 : 34} strokeWidth={1.3} /></div>
            <h3>{invitation.title}</h3>
            <p>{invitation.description}</p>
            <Link href="#sponsor-form" className={styles.link}>Become a premium sponsor <ArrowUpRight size={19} aria-hidden="true" /></Link>
          </>}
        </article>
      })}
    </div>
    <p className={styles.note}>Talk with our organizers about availability, recognition and partnership arrangements.</p>
  </section>
}

/** Home: one green sponsor band with the filled premium placements, a single logo marquee and a link to /sponsors/. */
export function SponsorBand() {
  return <section className={styles.band} data-tone="green" aria-labelledby="sponsor-band-title">
    <div className="page-shell">
      <SectionIntro tag="Our sponsors" title={"Local names.\nShared *community spirit.*"} tone="dark" id="sponsor-band-title" reveal
        subtitle="The businesses that back CICA and the CPL help bring every season to life." />
      {premiumSponsors.length > 0 && <ul className={styles.premiumRow} aria-label="Premium sponsors">
        {premiumSponsors.map(sponsor => {
          const href = safeHref(sponsor)
          const logo = sponsor.logo
            ? <span className={`${styles.premiumLogo} ${sponsor.logoTone === "dark" ? styles.darkLogoWell : ""}`}><Image src={sponsor.logo} alt="" width={260} height={140} sizes="260px" /></span>
            : null
          return <li key={sponsor.id} className={styles.premiumItem}>
            {logo}
            <span className={styles.premiumMeta}><span className={styles.premiumTag}>Premium sponsor</span><span className={styles.premiumName}>{sponsor.name}</span></span>
            {href && <SponsorLink sponsor={sponsor} href={href} />}
          </li>
        })}
      </ul>}
      {marqueeLogos.length > 0 && <SponsorLogoStrip logos={marqueeLogos} label="CPL sponsors" />}
      <div className={styles.bandCta}><CapsuleLink href="/sponsors/" tone="cream">Meet our sponsors</CapsuleLink></div>
    </div>
  </section>
}
