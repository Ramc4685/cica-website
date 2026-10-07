import { CapsuleLink } from "@/components/ui/capsule-link"
import { PageHero } from "@/components/ui/page-hero"
import { SectionIntro } from "@/components/ui/section-intro"
import { pageMetadata } from "@/lib/site-metadata"
import s from "../inner-page.module.css"
import styles from "./board.module.css"
export const metadata = pageMetadata("Our leadership", "Meet CICA’s directors and organizing team, supporting cricket and community in Central Illinois.", "/board/")

/** Season the roles and bios below were last confirmed for. */
const asOfSeason = 2026 // TODO(organizers): confirm current roles and tenures for this season.

const boardMembers = [
  {
    name: "RamC Venkatasamy",
    role: "Director",
    bio: "Director and organizer who has contributed to CICA since 2012.",
    specialties: ["Ground Management", "Tournament Innovation", "Facility Development"],
    achievements: [
      "Contributing to CICA since 2012",
      "Introduced multiple cricket divisions",
      "Moved tournament play to the 20-over format",
      "Led the Baywood ground arrangement through a city partnership",
      "Manages the CPL player auctions",
      "Secured indoor facilities for year-round cricket"
    ],
    playerRole: "All-rounder"
  },
  {
    name: "Ayaskant Rout",
    role: "Director",
    bio: "Director and tournament organizer who has contributed to CICA since 2019.",
    specialties: ["Community Building", "Tournament Organization"],
    achievements: [
      "Contributing since 2019",
      "Community engagement",
      "Tournament coordination"
    ],
    playerRole: "All-rounder"
  },
  {
    name: "Senthil Krishnan",
    role: "CICA Organizing Committee",
    bio: "Organizing committee member since 2021, responsible for tournament scheduling and coordination.",
    specialties: ["Tournament Organization", "Scheduling"],
    achievements: [
      "Organizing since 2021",
      "Tournament scheduling",
      "Event coordination"
    ],
    playerRole: "Organizer"
  }
]

export default function BoardPage() {
  return <>
    <PageHero tag="Our leadership" title={"The people\nbehind the *game.*"}
      intro="Meet the directors and organizers who help bring CICA’s community together." />

    <section className={`page-shell ${s.sectionFlush}`} aria-label="Directors and organizers">
      <p className={styles.season}>Roles listed for the {asOfSeason} season.</p>
      <ul className={styles.list}>
        {boardMembers.map(member => <li key={member.name}>
          <article className={styles.member} aria-labelledby={`member-${slug(member.name)}`}>
            <div className={styles.identity}>
              <span className={styles.monogram} aria-hidden="true">{initials(member.name)}</span>
              <div>
                <p className="tag-row">{member.role}</p>
                <h2 id={`member-${slug(member.name)}`} className={styles.name}>{member.name}</h2>
                <p className={styles.playerRole}>{member.playerRole}</p>
              </div>
            </div>
            <div className={styles.detail}>
              <p className={styles.bio}>{member.bio}</p>
              <ul className={styles.specialties} aria-label="Focus areas">
                {member.specialties.map(item => <li key={item}>{item}</li>)}
              </ul>
              <details className={styles.contributions}>
                <summary>Community contributions</summary>
                <ul>{member.achievements.map(item => <li key={item}>{item}</li>)}</ul>
              </details>
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
