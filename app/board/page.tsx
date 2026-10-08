import { CapsuleLink } from "@/components/ui/capsule-link"
import { PageHero } from "@/components/ui/page-hero"
import { SectionIntro } from "@/components/ui/section-intro"
import { OrganizerEditLink } from "@/components/organizer-edit-link"
import boardFile from "@/content/board.json"
import { boardFileSchema, parseContent } from "@/lib/content-schema"
import { pageMetadata } from "@/lib/site-metadata"
import s from "../inner-page.module.css"
import styles from "./board.module.css"
export const metadata = pageMetadata("Our leadership", "Meet CICA’s directors and organizing team, supporting cricket and community in Central Illinois.", "/board/")

/** Directors and organizers are edited through Pages CMS in content/board.json. */
const { asOfSeason, members: boardMembers } = parseContent(boardFileSchema, boardFile, "board.json")

export default function BoardPage() {
  return <>
    <PageHero tag="Our leadership" title={"The people\nbehind the *game.*"}
      intro="Meet the directors and organizers who help bring CICA’s community together." />

    <section className={`page-shell ${s.sectionFlush}`} aria-label="Directors and organizers">
      <p className={styles.season}>Roles listed for the {asOfSeason} season.</p>
      <OrganizerEditLink section="board" label="board members" />
      <ul className={styles.list}>
        {boardMembers.map(member => <li key={member.name}>
          <article className={styles.member} aria-labelledby={`member-${slug(member.name)}`}>
            <div className={styles.identity}>
              <span className={styles.monogram} aria-hidden="true">{initials(member.name)}</span>
              <div>
                <p className="tag-row">{member.role}</p>
                <h2 id={`member-${slug(member.name)}`} className={styles.name}>{member.name}</h2>
                {member.playerRole && <p className={styles.playerRole}>{member.playerRole}</p>}
              </div>
            </div>
            <div className={styles.detail}>
              <p className={styles.bio}>{member.bio}</p>
              {member.specialties.length > 0 && <ul className={styles.specialties} aria-label="Focus areas">
                {member.specialties.map(item => <li key={item}>{item}</li>)}
              </ul>}
              {member.achievements.length > 0 && <details className={styles.contributions}>
                <summary>Community contributions</summary>
                <ul>{member.achievements.map(item => <li key={item}>{item}</li>)}</ul>
              </details>}
            </div>
          </article>
        </li>)}
      </ul>
    </section>

    <section className={s.band} data-tone="green" aria-labelledby="board-help-title">
      <div className="page-shell">
        <div className={s.bandGrid}>
          <SectionIntro tag="Lend a hand" title={"You can help shape\nwhat comes *next.*"} align="start" tone="dark" id="board-help-title" reveal />
          <div>
            <p className={s.bandBody}>Interested in volunteering or helping with a tournament? Start a conversation with the organizers.</p>
            <div className={s.actions}>
              <CapsuleLink href="/get-involved/" tone="cream">Get involved</CapsuleLink>
              <CapsuleLink href="/bylaws/" tone="cream" variant="outline">Read the bylaws</CapsuleLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
}

function initials(name: string) {
  return name.split(" ").map(part => part[0]).join("")
}

function slug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
}
