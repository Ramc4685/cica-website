import { ArrowUpRight } from "lucide-react"
import { CapsuleLink } from "@/components/ui/capsule-link"
import { LogoMotionRibbon } from "@/components/logo-motion-ribbon"
import { HeroPhotoRotator } from "@/components/hero-photo-rotator"
import { communityLinks } from "@/lib/content"

export function Hero() {
  return <section className="growlio-hero" aria-labelledby="hero-title">
    <div className="page-shell growlio-hero-shell">
      <div className="hero-copy">
        <p className="tag-row">Central Illinois Cricket Association</p>
        <h1 id="hero-title">Cricket brings<br />our community<br />together.</h1>
        <p className="hero-description">A shared love of the game. A place to belong. We bring cricket, friendship, and community together in Bloomington–Normal, Illinois.</p>
        <CapsuleLink href="/get-involved/">Find your place</CapsuleLink>
        <a className="hero-score-link" href={communityLinks.scores} target="_blank" rel="noopener noreferrer">
          Fixtures &amp; scores <ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
      <HeroPhotoRotator />
      <LogoMotionRibbon />
    </div>
  </section>
}
