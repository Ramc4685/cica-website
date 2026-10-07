"use client"

import Image from "next/image"
import { useSiteMotion } from "@/components/site-motion"
import styles from "./sponsor-logo-strip.module.css"

export interface SponsorLogo { name: string; src: string }

/**
 * The single sponsor marquee. It drifts only while site motion runs and stops on hover or
 * focus; paused or reduced motion shows one static, wrapped row without the duplicate run.
 */
export function SponsorLogoStrip({ logos, label = "Our sponsors" }: { logos: readonly SponsorLogo[]; label?: string }) {
  const { motionEnabled } = useSiteMotion()
  return <div className={styles.stream} data-motion={motionEnabled ? "running" : "paused"}>
    <div className={styles.track}>
      <ul className={styles.set} aria-label={label}>
        {logos.map(logo => <li key={logo.src} className={styles.logo}><Image src={logo.src} alt={logo.name} width={150} height={65} /></li>)}
      </ul>
      <ul className={`${styles.set} ${styles.copy}`} aria-hidden="true">
        {logos.map(logo => <li key={logo.src} className={styles.logo}><Image src={logo.src} alt="" width={150} height={65} /></li>)}
      </ul>
    </div>
  </div>
}
