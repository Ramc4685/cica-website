import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Hero } from "@/components/hero"
import { SponsorBand } from "@/components/premium-sponsors"
import { ChampionsShowcase } from "@/components/sections/champions-showcase"
import { CompetitionCards } from "@/components/sections/competition-cards"
import { CricketFaq } from "@/components/sections/cricket-faq"
import { HowToJoin } from "@/components/sections/how-to-join"
import { MetricsStrip } from "@/components/sections/metrics-strip"
import { CapsuleLink } from "@/components/ui/capsule-link"
import { aboutPhotoIds, photoById, photoFocusStyle } from "@/lib/community-photos"

export const metadata: Metadata = { alternates: { canonical: "https://cicainfo.com/" } }

const [familyPhoto, fieldPhoto] = aboutPhotoIds.map(id => photoById(id))

/** Growlio about anatomy: short line, small photo, centered "Our story", small photo, short line; then the mission line. */
function AboutBand() {
  return <section className="about-band" data-tone="ink" aria-labelledby="about-title">
    <div className="page-shell">
      <div className="about-anatomy">
        <p className="about-line">Since 1998, organized cricket for <span className="whitespace-nowrap">Bloomington–Normal</span> and Central Illinois.</p>
        <figure className="about-thumb"><Image src={familyPhoto.src} width={familyPhoto.width} height={familyPhoto.height} alt={familyPhoto.alt} sizes="160px" className="community-photo" style={photoFocusStyle(familyPhoto)} /></figure>
        <h2 id="about-title" className="about-story">Our story</h2>
        <figure className="about-thumb"><Image src={fieldPhoto.src} width={fieldPhoto.width} height={fieldPhoto.height} alt={fieldPhoto.alt} sizes="160px" className="community-photo" style={photoFocusStyle(fieldPhoto)} /></figure>
        <p className="about-line">Friendships at the boundary, shared matchdays, and room to <Link href="/get-involved/">help bring people together</Link>.</p>
      </div>
      <p className="about-mission">We believe cricket is about <em>more than the game.</em></p>
      <div className="about-cta"><CapsuleLink href="/about/" tone="cream">Get to know us</CapsuleLink></div>
    </div>
  </section>
}

export default function HomePage() {
  return <>
    <Hero />
    <AboutBand />
    <CompetitionCards variant="home" />
    <HowToJoin />
    <ChampionsShowcase variant="compact" headingId="recent-champions-title" />
    <MetricsStrip />
    <SponsorBand />
    <CricketFaq tag="A good place to start" title={"New here?\n*You’re welcome.*"} />
  </>
}
