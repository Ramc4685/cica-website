import Link from "next/link"
import { ChevronsRight, ArrowUpRight } from "lucide-react"
import { LogoMotionRibbon } from "@/components/logo-motion-ribbon"
import { HeroPhotoRotator } from "@/components/hero-photo-rotator"

export function Hero() {
  return <section className="growlio-hero"><div className="page-shell growlio-hero-shell"><div className="hero-copy"><p className="eyebrow">CENTRAL ILLINOIS CRICKET ASSOCIATION</p><h1>Cricket brings<br />our community<br />together.</h1><p className="hero-description">A shared love of the game. A place to belong. We bring cricket, friendship, and community together in Bloomington–Normal, Illinois.</p><Link className="hero-cta" href="/get-involved/"><span className="cta-icon"><ChevronsRight aria-hidden="true" /></span><span className="cta-label">Find your place</span></Link><a className="hero-score-link" href="https://cricclubs.com/CICA" target="_blank" rel="noopener noreferrer">Fixtures & scores <ArrowUpRight size={17} aria-hidden="true"/></a></div><HeroPhotoRotator/><LogoMotionRibbon/></div></section>
}
