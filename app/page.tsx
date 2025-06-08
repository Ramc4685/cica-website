import { Hero } from "@/components/hero"
import { LatestNews } from "@/components/latest-news"
import { QuickLinks } from "@/components/quick-links"
import { FeaturedTournaments } from "@/components/featured-tournaments"
import { LogoCarousel } from "@/components/logo-carousel"
import { Testimonials } from "@/components/testimonials"
import { CricketStats } from "@/components/cricket-stats"

export default function HomePage() {
  return (
    <div className="space-y-0">
      <Hero />
      <LogoCarousel />
      <CricketStats />
      <QuickLinks />
      <FeaturedTournaments />
      <LatestNews />
      <Testimonials />
    </div>
  )
}
