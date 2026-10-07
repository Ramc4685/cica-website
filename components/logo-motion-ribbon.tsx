"use client"

import { useEffect, useRef } from "react"
import { cplSponsors, cplTeams } from "@/lib/brand-assets"
import { useSiteMotion } from "@/components/site-motion"

const logos = [
  ...["main", "tournaments", "mains", "cpl", "mini", "indoor", "100"].map(id => ({ src: `/images/cica-logo-${id}.webp`, category: "CICA" })),
  ...cplTeams.map(team => ({ src: `/images/teams/${team.id}.webp`, category: "team" })),
  ...cplSponsors.map(sponsor => ({ src: `/images/sponsors/${sponsor.id}.webp`, category: "sponsor" })),
]
// Interleave identities, teams and sponsors so each group is visible throughout the flow.
const flow = Array.from({ length: 8 }, (_, i) => [logos[i % 7], logos[7 + i], logos[15 + i]]).flat()
const path = "M-650 145 C-350 145 -120 145 0 110 C145 -20 310 225 545 135 S935 45 1240 120 C1550 145 1750 145 1950 145"

export function LogoMotionRibbon() {
  const svg = useRef<SVGSVGElement>(null)
  const { motionEnabled, ready, reducedMotion } = useSiteMotion()
  useEffect(() => {
    if (!svg.current) return
    if (motionEnabled) svg.current.unpauseAnimations()
    else svg.current.pauseAnimations()
  }, [motionEnabled, ready])
  return <div className="logo-motion-ribbon" aria-hidden="true"><svg ref={svg} viewBox="0 0 1240 220" role="presentation"><path d={path} fill="none" stroke="#034F47" strokeOpacity=".35" strokeWidth="1.5" />{flow.map((logo, i) => <g key={`${logo.src}-${i}`} transform={!ready || reducedMotion ? `translate(${i * 57 - 35} ${110 + Math.sin(i * .48) * 35})` : undefined}><rect x="-37" y="-37" width="74" height="74" rx="15" fill="#FAFADD" stroke="#034F4722" /><image href={logo.src} x="-31" y="-31" width="62" height="62" preserveAspectRatio="xMidYMid meet" />{ready && !reducedMotion && <animateMotion path={path} dur="50s" begin={`${-50 * i / flow.length}s`} repeatCount="indefinite" rotate="0" calcMode="paced" />}</g>)}</svg></div>
}
