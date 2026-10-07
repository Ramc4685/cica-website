import Image from "next/image"
import Link from "next/link"
import { ChevronsRight, ArrowUpRight } from "lucide-react"
import { LogoMotionRibbon } from "@/components/logo-motion-ribbon"
import { heroPhoto } from "@/lib/community-photos"

export function Hero() {
  return <section className="growlio-hero"><div className="page-shell growlio-hero-shell"><div className="hero-copy"><p className="eyebrow">CENTRAL ILLINOIS CRICKET ASSOCIATION</p><h1>Cricket brings<br />our community<br />together.</h1><p className="hero-description">A shared love of the game. A place to belong. We bring cricket, friendship, and community together in Bloomington–Normal, Illinois.</p><Link className="hero-cta" href="/get-involved/"><span className="cta-icon"><ChevronsRight aria-hidden="true" /></span><span className="cta-label">Find your place</span></Link><a className="hero-score-link" href="https://cricclubs.com/CICA" target="_blank" rel="noopener noreferrer">Fixtures & scores <ArrowUpRight size={17} aria-hidden="true"/></a></div><div className="growlio-hero-image"><Image src={heroPhoto.src} alt={heroPhoto.alt} fill priority sizes="(max-width:760px) 90vw, 42vw" className="object-cover" style={{objectPosition:"50% 50%"}}/><span className="hero-image-badge">LOCAL ROOTS. SHARED PASSION.</span><div className="hero-image-brand"><Image src="/images/cica-logo-main.webp" width={120} height={140} alt="CICA"/><span>THE GAME IS BETTER<br />WHEN WE&apos;RE TOGETHER.</span></div></div><LogoMotionRibbon/></div></section>
}
