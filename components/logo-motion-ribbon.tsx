"use client"

import { useEffect, useRef } from "react"
import { cplSponsors, cplTeams } from "@/lib/brand-assets"
import { useSiteMotion } from "@/components/site-motion"

// Small (<8KB) derivatives from public/images/logos-sm/; the tiles render at 62px.
const identities = ["main", "tournaments", "mains", "cpl", "mini", "indoor", "100"].map(id => `/images/logos-sm/cica-logo-${id}.webp`)
const teamLogos = cplTeams.map(team => team.small)
const sponsorLogos = cplSponsors.map(sponsor => sponsor.small)
// Interleave identities, teams and sponsors so each group is visible throughout the flow.
const flow = Array.from({ length: Math.max(8, teamLogos.length, sponsorLogos.length) }, (_, i) => [identities[i % identities.length], teamLogos[i % teamLogos.length], sponsorLogos[i % sponsorLogos.length]].filter((src): src is string => Boolean(src))).flat()
const path = "M-650 145 C-350 145 -120 145 0 110 C145 -20 310 225 545 135 S935 45 1240 120 C1550 145 1750 145 1950 145"
/** Alternating tile tilt, in degrees. */
const tilt = (i: number) => (i % 2 === 0 ? -8 : 11) + (i % 3) * 2

export function LogoMotionRibbon() {
  const svg = useRef<SVGSVGElement>(null)
  const { motionEnabled, ready, reducedMotion } = useSiteMotion()
  useEffect(() => {
    if (!svg.current) return
    if (motionEnabled) svg.current.unpauseAnimations()
    else svg.current.pauseAnimations()
  }, [motionEnabled, ready])
  const moving = ready && !reducedMotion
  return <div className="logo-motion-ribbon" aria-hidden="true">
    <svg ref={svg} viewBox="0 0 1240 220" focusable="false">
      <path d={path} className="ribbon-path" />
      {flow.map((src, i) => <g key={`${src}-${i}`} transform={moving ? undefined : `translate(${i * 57 - 35} ${110 + Math.sin(i * .48) * 35})`}>
        <g transform={`rotate(${tilt(i)})`}>
          <rect x="-37" y="-37" width="74" height="74" rx="15" className="ribbon-tile" />
          <image href={src} x="-31" y="-31" width="62" height="62" preserveAspectRatio="xMidYMid meet" />
        </g>
        {moving && <animateMotion path={path} dur="50s" begin={`${-50 * i / flow.length}s`} repeatCount="indefinite" rotate="0" calcMode="paced" />}
      </g>)}
    </svg>
  </div>
}
