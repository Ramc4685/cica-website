import Image from "next/image"
import { CalendarDays, HeartHandshake, Snowflake, Sun, Trophy } from "lucide-react"
import { CapsuleLink } from "@/components/ui/capsule-link"
import { PageHero } from "@/components/ui/page-hero"
import { SectionIntro } from "@/components/ui/section-intro"
import { communityPhotos, photoFocusStyle } from "@/lib/community-photos"
import { pageMetadata } from "@/lib/site-metadata"
import s from "../inner-page.module.css"

export const metadata = pageMetadata("About our community", "Learn about CICA’s story, purpose and community in Bloomington–Normal and Central Illinois.", "/about/")

const bannerPhoto = communityPhotos.find(photo => photo.id === "community-on-field") ?? communityPhotos[0]

// Facts only: each line restates what lib/content.ts and the association record already say.
const offers = [
  { icon: Sun, title: "Outdoor seasons", copy: "CICA Mains, CPL Outdoor, the Mini Tournament and Challengers bring teams together on the field." },
  { icon: Snowflake, title: "Indoor cricket", copy: "CICA Indoor and CPL Indoor keep the community playing beyond the outdoor season." },
  { icon: Trophy, title: "The CPL league", copy: "The Cricket Premier League, with teams named for their sponsors, plays both outdoors and indoors." },
  { icon: HeartHandshake, title: "Volunteer and family roles", copy: "Players, families, volunteers and supporters all help make matchdays happen." },
  { icon: CalendarDays, title: "Since 1998", copy: "Organized cricket in Bloomington–Normal and Central Illinois for more than 25 years." },
] as const

export default function AboutPage() {
  return <>
    <PageHero tag="Our story" title={"One game.\nA community of *connections.*"}
      intro="Cricket gives us a reason to come together. The people make us want to stay." />

    <figure className={s.fullBleed}>
      <Image src={bannerPhoto.src} width={bannerPhoto.width} height={bannerPhoto.height} alt={bannerPhoto.alt}
        sizes="100vw" className="community-photo" style={photoFocusStyle(bannerPhoto)} />
    </figure>

    <section className={`page-shell ${s.section}`} aria-labelledby="about-story-title">
      <div className={s.split}>
        <SectionIntro tag="Rooted in Central Illinois" title="A place for the love of *cricket.*" align="start" id="about-story-title" reveal />
        <div>
          <p className={s.body}>Founded in 1998, the Central Illinois Cricket Association brings organized cricket to Bloomington–Normal and the surrounding community. Local players, organizers and supporters have shaped its story together.</p>
          <p className={s.body}>From outdoor tournaments to indoor competitions, CICA creates opportunities to play, compete and connect. Our purpose remains close to home: develop cricket and build a welcoming community around it.</p>
        </div>
      </div>
    </section>

    <section className={`page-shell ${s.sectionFlush}`} aria-labelledby="about-offer-title">
      <div className={s.split}>
        <div className={s.sticky}>
          <SectionIntro tag="Why CICA" title={"What we\n*offer.*"} align="start" id="about-offer-title" reveal
            subtitle="Formats through the year, and a role for everyone who wants one." />
          <CapsuleLink href="/get-involved/">Find your place</CapsuleLink>
        </div>
        <ul className={s.offerList}>
          {offers.map(({ icon: Icon, title, copy }) => <li key={title}>
            <span className={s.iconBox} aria-hidden="true"><Icon /></span>
            <div><h3>{title}</h3><p className={s.body}>{copy}</p></div>
          </li>)}
        </ul>
      </div>
    </section>

    <section className={s.band} data-tone="ink" aria-labelledby="about-people-title">
      <div className="page-shell">
        <div className={s.bandGrid}>
          <SectionIntro tag="People and purpose" title={"Built by people\nwho *care.*"} align="start" tone="dark" id="about-people-title" reveal />
          <div>
            <p className={s.bandBody}>Meet the directors and organizers behind CICA, or read the bylaws that set out how the association is governed.</p>
            <div className={s.actions}>
              <CapsuleLink href="/board/" tone="cream">Meet our leadership</CapsuleLink>
              <CapsuleLink href="/bylaws/" tone="cream" variant="outline">Read the bylaws</CapsuleLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
}
