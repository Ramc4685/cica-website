"use client"

import Image from "next/image"
import { cplSponsors } from "@/lib/brand-assets"
import { premiumSponsors } from "@/lib/premium-sponsors"
import { useSiteMotion } from "@/components/site-motion"

const logos = [
  ...cplSponsors.map(sponsor => ({ name: sponsor.name, src: `/images/sponsors/${sponsor.id}.webp` })),
  ...premiumSponsors.filter(sponsor => sponsor.logo && !cplSponsors.some(item => `/images/sponsors/${item.id}.webp` === sponsor.logo)).map(sponsor => ({ name: sponsor.name, src: sponsor.logo! })),
]

export function SponsorLogoStrip() {
  const { motionEnabled } = useSiteMotion()
  return <div className="sponsor-stream" data-motion={motionEnabled ? "running" : "paused"}>
    <div className="sponsor-stream-track">{[0, 1].map(copy => <div className="sponsor-stream-set" key={copy} aria-hidden={copy === 1}>
      {logos.map(logo => <Image key={logo.src} src={logo.src} alt={copy === 0 ? logo.name : ""} width={150} height={65} className="object-contain" />)}
    </div>)}</div>
  </div>
}
