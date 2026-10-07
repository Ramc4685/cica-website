import Image from "next/image"
import { SectionIntro } from "@/components/ui/section-intro"
import { cplSponsors } from "@/lib/brand-assets"
import { premiumSponsors } from "@/lib/premium-sponsors"
import s from "../inner-page.module.css"
import styles from "./sponsors.module.css"

/** Only absolute http(s) URLs supplied by the sponsor are linked. */
const safeHref = (href?: string) => href && /^https?:\/\//i.test(href) ? href : undefined

/** Owner-approved sponsors on an ink band. Links render only once a sponsor has supplied its website. */
export function SponsorList() {
  return <section className={s.band} data-tone="ink" aria-labelledby="sponsor-list-title">
    <div className="page-shell">
      <SectionIntro tag="Our sponsors" title={"The local names\nbehind the *game.*"} tone="dark" id="sponsor-list-title" reveal
        subtitle="Businesses that support CICA tournaments and the community around them." />

      {premiumSponsors.length > 0 && <>
        <h3 className={styles.groupTitle}>Premium sponsors</h3>
        <ul className={styles.premium}>
          {premiumSponsors.map(sponsor => {
            const href = safeHref(sponsor.href)
            return <li key={sponsor.id}>
              <article className={styles.premiumCard} aria-labelledby={`sponsor-${sponsor.id}`}>
                {sponsor.logo && <div className={styles.well} data-logo-tone={sponsor.logoTone ?? "light"}>
                  <Image src={sponsor.logo} alt="" width={420} height={230} sizes="(max-width: 900px) 100vw, 40vw" />
                </div>}
                <p className="tag-row">Premium sponsor</p>
                <h4 id={`sponsor-${sponsor.id}`} className={styles.name}>{sponsor.name}</h4>
                {sponsor.description && <p className={styles.description}>{sponsor.description}</p>}
                {href && <a className={styles.visit} href={href} target="_blank" rel="noopener sponsored">
                  Visit {sponsor.name}<span className="sr-only"> (opens in a new tab)</span>
                </a>}
              </article>
            </li>
          })}
        </ul>
      </>}

      <h3 className={styles.groupTitle}>CPL team sponsors</h3>
      <ul className={styles.cpl}>
        {cplSponsors.map(sponsor => <li key={sponsor.id} className={styles.cplItem}>
          <span className={styles.cplLogo}><Image src={`/images/sponsors/${sponsor.id}.webp`} alt="" width={160} height={88} loading="lazy" /></span>
          <span>{sponsor.name}</span>
        </li>)}
      </ul>
    </div>
  </section>
}
