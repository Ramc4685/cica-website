import { CapsuleLink } from "@/components/ui/capsule-link"
import { PageHero } from "@/components/ui/page-hero"
import { OrganizerToggle } from "@/components/organizer-toggle"
import { CMS_SECTIONS, cmsEditorUrl, cmsSectionUrl } from "@/lib/cms"
import s from "../inner-page.module.css"

const steps = [
  "Open the content editor and sign in with the email invite you received.",
  "Choose a section below, make your change and press Save.",
  "Check your change on staging.cicainfo.com within a few minutes.",
  "The site owner approves it, and it appears on cicainfo.com.",
]

export default function OrganizerTools() {
  return <>
    <PageHero tag="Organizers" className="utility-hero" title={<>Organizer tools</>}
      intro="Update champions, tournaments, news, events, the FAQ and gallery photos without touching any code. Nothing you save goes public until the site owner approves it.">
      <div className={`${s.actions} ${s.heroActions}`}>
        <CapsuleLink href={cmsEditorUrl} external>Open the content editor</CapsuleLink>
        <CapsuleLink href="/" variant="outline">Return to website</CapsuleLink>
      </div>
    </PageHero>

    <section className={`page-shell ${s.sectionFlush}`} aria-labelledby="edit-sections-title">
      <div className={s.card}>
        <h2 id="edit-sections-title" className={s.cardTitle}>Jump to a section</h2>
        <p className={s.body}>Each button opens that part of the content editor in a new tab.</p>
        <ul className="organizer-sections">
          {CMS_SECTIONS.map(section => <li key={section.name}>
            <a href={cmsSectionUrl(section.name)} target="_blank" rel="noopener noreferrer">
              <strong>{section.label}<span className="sr-only"> (opens in a new tab)</span></strong>
              <span>{section.hint}</span>
            </a>
          </li>)}
        </ul>
      </div>
    </section>

    <section className={`page-shell ${s.sectionFlush}`} aria-labelledby="how-publishing-title">
      <div className={`${s.card} ${s.cardGrid}`}>
        <div>
          <h2 id="how-publishing-title" className={s.cardTitle}>How publishing works</h2>
          <ol className="organizer-steps">{steps.map(step => <li key={step}>{step}</li>)}</ol>
          <p className={s.body}>Made a mistake? Tell the site owner and they can undo it before or after it goes live.</p>
        </div>
        <div>
          <h2 className={s.cardTitle}>No GitHub account?</h2>
          <p className={s.body}>You do not need one. Ask the site owner to invite you as a Pages CMS collaborator by email, then sign in from the invite.</p>
          <p className={s.body}>Questions? Email <a href="mailto:organizers@cicainfo.com">organizers@cicainfo.com</a>.</p>
        </div>
      </div>
    </section>

    <section className={`page-shell ${s.sectionFlush}`} aria-labelledby="edit-links-title">
      <div className={s.card}>
        <h2 id="edit-links-title" className={s.cardTitle}>Edit links on the public pages</h2>
        <p className={s.body}>Turn this on to see a small &quot;Edit this section&quot; link beside champions, tournaments, events, sponsors, venues and the FAQ. It is saved only in this browser, and visitors never see it.</p>
        <OrganizerToggle />
      </div>
    </section>
  </>
}
