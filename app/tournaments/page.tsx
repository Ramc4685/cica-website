import { CompetitionCards } from "@/components/sections/competition-cards"
import { CricketFaq } from "@/components/sections/cricket-faq"
import { UpcomingSeason } from "@/components/sections/upcoming-season"
import { WhereWePlay } from "@/components/sections/where-we-play"
import { CPLTeamShowcase } from "@/components/team-logo"
import { CapsuleLink } from "@/components/ui/capsule-link"
import { PageHero } from "@/components/ui/page-hero"
import { SectionIntro } from "@/components/ui/section-intro"
import { communityPhotos } from "@/lib/community-photos"
import { communityLinks } from "@/lib/content"
import { pageMetadata } from "@/lib/site-metadata"
import s from "../inner-page.module.css"

export const metadata = pageMetadata("Cricket tournaments", "Explore CICA’s indoor and outdoor cricket tournaments, find scores and ask about upcoming participation.", "/tournaments/")

const heroPhoto = communityPhotos.find(photo => photo.id === "outdoor-teams") ?? communityPhotos[0]

export default function TournamentsPage() {
  return <>
    <PageHero tag="On the field" title={"Different formats.\nThe same love of *cricket.*"}
      intro="Explore CICA’s indoor and outdoor competitions, then connect with an organizer about the right next step."
      image={heroPhoto}>
      <div className={s.actions} style={{ marginTop: 32 }}>
        <CapsuleLink href={communityLinks.scores} external>Fixtures and scores</CapsuleLink>
      </div>
    </PageHero>

    <CompetitionCards variant="page" tag="Our competitions" title={"Outdoor and indoor,\nall *year.*"} headingId="competitions-title" />

    <div id="where-we-play">
      <WhereWePlay className={s.flushTop} />
    </div>

    <UpcomingSeason className={s.flushTop} />

    <section className={s.band} data-tone="green" aria-labelledby="before-register-title">
      <div className="page-shell">
        <div className={s.bandGrid}>
          <SectionIntro tag="Before you register" title={"Let’s get you the\nright *details.*"} align="start" tone="dark" id="before-register-title" reveal />
          <div>
            <p className={s.bandBody}>Dates, venues, fees, eligibility and registration arrangements depend on the competition. Check the tournament listing on CricClubs and confirm details with the organizers before making plans. Current event rules take precedence over general format descriptions.</p>
            <div className={s.actions}>
              <CapsuleLink href="/rules/" tone="cream">Rules and documents</CapsuleLink>
              <CapsuleLink href="/get-involved/" tone="cream" variant="outline">New to CICA? Start here</CapsuleLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <CricketFaq tag="Registration questions" headingId="tournament-faq-title" />

    <section className={`page-shell ${s.sectionFlush}`}>
      <CPLTeamShowcase />
    </section>
  </>
}
