import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, HeartHandshake } from "lucide-react"
import { premiumSponsors } from "@/lib/premium-sponsors"
import styles from "./premium-sponsors.module.css"

const invitations = [
  { title: "Lead the way.", description: "Bring your organization closer to the people and the game that connect Central Illinois." },
  { title: "Be part of matchday.", description: "Make a connection through the shared excitement of local cricket." },
  { title: "Back the community.", description: "Start a conversation about supporting the moments that bring people together." },
]

export function PremiumSponsors({ compact = false }: { compact?: boolean }) {
  const headingId = compact ? "home-premium-sponsors-heading" : "premium-sponsors-heading"
  const inquiryHref = compact ? "/sponsors/#form-heading" : "#form-heading"

  return <section className={`${styles.section} ${compact ? "page-shell home-section" : "mb-16"}`} aria-labelledby={headingId}>
    <div className={styles.intro}>
      <div><p className="eyebrow">Premium partnerships</p><h2 id={headingId} className="section-heading">Our premium sponsors.<br /><em>Here for the community.</em></h2></div>
      <p>Give your organization a place alongside our cricket community. Let’s explore a partnership with CICA.</p>
    </div>
    <div className={styles.placements}>
      {invitations.map((invitation, index) => {
        const sponsor = premiumSponsors[index]
        const sponsorHref = sponsor?.href
        const safeHref = sponsorHref && (/^https?:\/\//i.test(sponsorHref) || /^\/(?!\/)/.test(sponsorHref)) ? sponsorHref : undefined
        return <article key={sponsor?.id ?? `invitation-${index}`} className={`${styles.card} ${index === 0 ? styles.lead : styles.supporting}`}>
          <div className={styles.cardTop}><span>{sponsor ? "Premium sponsor" : "Premium partnership opportunity"}</span><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span></div>
          {sponsor ? <>
            {sponsor.logo ? <>
              <div className={`${styles.logoWell} ${sponsor.logoTone === "dark" ? styles.darkLogoWell : ""}`}><Image src={sponsor.logo} alt={`${sponsor.name} logo`} width={420} height={230} sizes={index === 0 ? "(max-width: 767px) 100vw, 50vw" : "(max-width: 767px) 100vw, 35vw"} /></div>
              <h3>{sponsor.name}</h3>
            </> : <div className={styles.wordmark}><h3>{sponsor.name}</h3></div>}
            {sponsor.description && <p>{sponsor.description}</p>}
            {safeHref && <a href={safeHref} target={safeHref.startsWith("http") ? "_blank" : undefined} rel={safeHref.startsWith("http") ? "noopener noreferrer" : undefined} className={styles.link}>Meet {sponsor.name} <ArrowUpRight size={19} aria-hidden="true" /></a>}
          </> : <>
            <div className={styles.invitationMark} aria-hidden="true"><HeartHandshake size={index === 0 ? 48 : 34} strokeWidth={1.3} /></div>
            <h3>{invitation.title}</h3>
            <p>{invitation.description}</p>
            <Link href={inquiryHref} className={styles.link}>Become a premium sponsor <ArrowUpRight size={19} aria-hidden="true" /></Link>
          </>}
        </article>
      })}
    </div>
    <p className={styles.note}>Talk with our organizers about availability, recognition and partnership arrangements.</p>
  </section>
}
