import { PathwayCards } from "@/components/sections/pathway-cards"
import { CapsuleLink } from "@/components/ui/capsule-link"
import { PageHero } from "@/components/ui/page-hero"
import { SectionIntro } from "@/components/ui/section-intro"
import { communityLinks } from "@/lib/content"
import { pageMetadata } from "@/lib/site-metadata"
import s from "../inner-page.module.css"

export const metadata = pageMetadata("Get involved", "Find your place in CICA: ask about playing cricket, volunteer, watch a match, support the association or request community updates.", "/get-involved/")

export default function GetInvolvedPage() {
  return <>
    <PageHero tag="There’s a place for you here" title={"Come for the cricket.\nStay for the *community.*"}
      intro="Whether you want to play, help out, cheer from the boundary or simply keep in touch, let’s find your next step." />

    <PathwayCards className={s.flushTop} />

    <section className={`page-shell ${s.sectionFlush}`} aria-labelledby="where-we-play-link-title">
      <div className={`${s.card} ${s.bandGrid}`}>
        <div>
          <h2 id="where-we-play-link-title" className={s.cardTitle}>Where we play</h2>
          <p className={s.body}>See the grounds and indoor courts CICA uses, then confirm the venue for each match with an organizer or on CricClubs before you travel.</p>
        </div>
        <div className={s.actions}>
          <CapsuleLink href="/tournaments/#where-we-play" variant="outline">See the venues</CapsuleLink>
        </div>
      </div>
    </section>

    <section className={s.band} data-tone="green" aria-labelledby="stay-in-touch-title">
      <div className="page-shell">
        <SectionIntro tag="Stay in touch" title={"Keep the community\n*close.*"} tone="dark" id="stay-in-touch-title" reveal />
        <div className={s.bandColumns}>
          <article className={s.bandCard} aria-labelledby="updates-card-title">
            <h3 id="updates-card-title" className={s.cardTitle}>Request email updates</h3>
            <p className={s.bandBody}>Leave your details for community updates. This is an updates request, separate from team or tournament registration.</p>
            <CapsuleLink href="/join/" tone="cream">Request updates</CapsuleLink>
          </article>
          <article className={s.bandCard} aria-labelledby="whatsapp-card-title">
            <h3 id="whatsapp-card-title" className={s.cardTitle}>Join the conversation</h3>
            <p className={s.bandBody}>Our WhatsApp community is another way to connect. WhatsApp’s group privacy settings apply, and your profile or phone number may be visible to others. If the invitation is unavailable, contact an organizer.</p>
            <CapsuleLink href={communityLinks.whatsapp} tone="cream" variant="outline" external>Open WhatsApp community</CapsuleLink>
          </article>
        </div>
      </div>
    </section>
  </>
}
