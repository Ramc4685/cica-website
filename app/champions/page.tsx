import { ChampionsShowcase } from "@/components/sections/champions-showcase"
import { CapsuleLink } from "@/components/ui/capsule-link"
import { PageHero } from "@/components/ui/page-hero"
import { SectionIntro } from "@/components/ui/section-intro"
import { communityLinks } from "@/lib/content"
import { pageMetadata } from "@/lib/site-metadata"
import s from "../inner-page.module.css"

export const metadata = pageMetadata("Champions archive", "Celebrate CICA tournament champions and explore recorded results from the association’s cricket history.", "/champions/")

export default function ChampionsPage() {
  return <>
    <PageHero tag="The champions archive" title={"Great teams.\nMemorable *seasons.*"}
      intro="A celebration of the teams recorded in CICA’s tournament history. Some years and runners-up are not recorded here, so the archive is not a complete season history." />

    <ChampionsShowcase className={s.flushTop} />

    <section className={s.band} data-tone="ink" aria-labelledby="archive-help-title">
      <div className="page-shell">
        <div className={s.bandGrid}>
          <SectionIntro tag="Help complete the archive" title={"Have a missing\nresult to *share?*"} align="start" tone="dark" id="archive-help-title" reveal />
          <div>
            <p className={s.bandBody}>Send organizers a correction or a season that is missing here. Live results and recent seasons are on CricClubs.</p>
            <div className={s.actions}>
              <CapsuleLink href="/contact/" tone="cream">Send a correction</CapsuleLink>
              <CapsuleLink href={communityLinks.scores} tone="cream" variant="outline" external>Latest results</CapsuleLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
}
