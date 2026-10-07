"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useId, useState } from "react"
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react"
import { cplSponsors } from "@/lib/brand-assets"
import { useSiteMotion } from "@/components/site-motion"
import { SectionIntro } from "@/components/ui/section-intro"
import styles from "./sponsor-spotlight.module.css"

/** /sponsors: rotating CPL sponsor spotlight with a logo selector. Rotation follows site motion and stops on hover or focus. */
export function SponsorSpotlight() {
  const headingId = useId()
  const [selected, setSelected] = useState(0)
  const [hovering, setHovering] = useState(false)
  const [focused, setFocused] = useState(false)
  const { motionEnabled } = useSiteMotion()
  const animate = motionEnabled && !hovering && !focused
  const sponsor = cplSponsors[selected]

  useEffect(() => {
    if (!animate) return
    const timer = window.setInterval(() => setSelected(current => (current + 1) % cplSponsors.length), 7000)
    return () => window.clearInterval(timer)
  }, [animate, selected])

  function move(direction: number) {
    setSelected(current => (current + direction + cplSponsors.length) % cplSponsors.length)
  }

  return <section
    aria-labelledby={headingId}
    className={`${styles.section} page-shell`}
    data-motion={motionEnabled ? "running" : "paused"}
    onMouseEnter={() => setHovering(true)}
    onMouseLeave={() => setHovering(false)}
    onFocusCapture={() => setFocused(true)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}
  >
    <SectionIntro tag="Community partnerships" title={<>Our CPL sponsors.<br /><em>Part of the bigger picture.</em></>} id={headingId}
      subtitle="Celebrating the businesses connected with CICA’s CPL community. Discover the local names that share our love of bringing people together." />
    <div className={styles.spotlight} data-tone="green">
      <div className={styles.copy}>
        <p className="tag-row">Sponsor spotlight</p>
        <h3>{sponsor.name}</h3>
        <p>Cricket connects people. Community partnerships are another way to be part of the game.</p>
        <Link href="#sponsor-form" className={styles.inquiry}>Let’s talk sponsorship <ArrowUpRight size={19} aria-hidden="true" /></Link>
        <div className={styles.controls}>
          <p className={styles.count}><span className="sr-only">Sponsor {selected + 1} of {cplSponsors.length}</span><span aria-hidden="true">{String(selected + 1).padStart(2, "0")} <span>/ {String(cplSponsors.length).padStart(2, "0")}</span></span></p>
          <div><button type="button" onClick={() => move(-1)} aria-label="Previous sponsor"><ArrowLeft size={20} aria-hidden="true" /></button><button type="button" onClick={() => move(1)} aria-label="Next sponsor"><ArrowRight size={20} aria-hidden="true" /></button></div>
        </div>
      </div>
      <div className={styles.logoStage}>
        <span className={styles.corner} aria-hidden="true">CPL sponsors</span>
        <div className={styles.logoWell} key={sponsor.id}><Image src={`/images/sponsors/${sponsor.id}.webp`} alt={`${sponsor.name} logo`} width={500} height={300} sizes="(max-width: 767px) 100vw, 50vw" className={styles.featuredLogo} /></div>
        <span className={styles.stageLabel}>Local names. Shared community spirit.</span>
      </div>
    </div>
    <div className={styles.selector} role="group" aria-label="Choose a sponsor">
      {cplSponsors.map((item, index) => <button key={item.id} type="button" aria-pressed={selected === index} aria-label={`Show ${item.name}`} onClick={() => setSelected(index)} className={styles.selectorButton}><Image src={`/images/sponsors/${item.id}.webp`} alt="" width={140} height={85} loading="lazy" /><span>{item.name}</span></button>)}
    </div>
    <p className={styles.note}>Interested in supporting local cricket? Talk with our organizers about current sponsorship opportunities.</p>
  </section>
}
