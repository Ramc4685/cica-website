import Image from "next/image"
import { OrganizerEditLink } from "@/components/organizer-edit-link"
import { CommunityGallery } from "@/components/community-gallery"
import { CapsuleLink } from "@/components/ui/capsule-link"
import { PageHero } from "@/components/ui/page-hero"
import { SectionIntro } from "@/components/ui/section-intro"
import { communityLinks } from "@/lib/content"
import { pageMetadata } from "@/lib/site-metadata"
import s from "../inner-page.module.css"
import styles from "@/components/logo-grid.module.css"

export const metadata = pageMetadata("Community moments", "Explore real CICA team photographs, cricket celebrations and community moments from Central Illinois.", "/gallery/")

const logos = [
  { id: "main", name: "CICA" },
  { id: "tournaments", name: "CICA Tournaments" },
  { id: "mains", name: "CICA Mains" },
  { id: "cpl", name: "CPL" },
  { id: "mini", name: "CICA Mini" },
  { id: "indoor", name: "CICA Indoor" },
  { id: "100", name: "CICA 100" },
]

export default function GalleryPage() {
  return <>
    <PageHero tag="Community moments" title={"More than\na *matchday.*"}
      intro="The teams, the celebrations, and the people who make CICA feel like a community." />

    <section className={`page-shell ${s.sectionFlush}`} aria-labelledby="photos-heading">
      <SectionIntro tag="Our people, our game" title="This is *CICA.*" id="photos-heading" variant="label"
        subtitle="Moments from our community collection. Select a photograph to see it in full." />
      <OrganizerEditLink section="photos" label="gallery photos" />
      <CommunityGallery />
    </section>

    <section className={`page-shell ${s.sectionFlush}`} aria-labelledby="channels-heading">
      <div className={`${s.card} ${s.bandGrid}`}>
        <div>
          <h2 id="channels-heading" className={s.cardTitle}>Keep exploring.</h2>
          <p className={s.body}>Find more community posts on Facebook and available cricket videos on YouTube. Some Facebook content may require you to sign in.</p>
        </div>
        <div className={s.actions}>
          <CapsuleLink href={communityLinks.facebook} variant="outline" external>Facebook</CapsuleLink>
          <CapsuleLink href={communityLinks.youtube} variant="outline" external>YouTube</CapsuleLink>
        </div>
      </div>
    </section>

    <section className={`page-shell ${s.sectionFlush}`} aria-labelledby="identity-heading">
      <SectionIntro tag="Our visual identity" title={"One association.\nMany ways to *play.*"} id="identity-heading"
        subtitle="The CICA logo family, from the association identity to its tournament artwork." reveal />
      <ul className={styles.logos}>
        {logos.map(logo => <li key={logo.id}>
          <figure className={styles.logo}>
            <Image src={`/images/cica-logo-${logo.id}.webp`} width={160} height={160} alt="" />
            <figcaption>{logo.name}</figcaption>
          </figure>
        </li>)}
      </ul>
    </section>

    <section className={s.band} data-tone="green" aria-labelledby="share-heading">
      <div className="page-shell">
        <div className={s.bandGrid}>
          <SectionIntro tag="Share a moment" title={"Have a CICA moment\nto *share?*"} align="start" tone="dark" id="share-heading" reveal />
          <div>
            <p className={s.bandBody}>Contact the organizers about sharing photos or a community story. Please only share material you have permission to publish, including permission from the people pictured.</p>
            <div className={s.actions}>
              <CapsuleLink href="/contact/" tone="cream">Share with the organizers</CapsuleLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
}
