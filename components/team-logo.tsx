import Image from "next/image"
import { SectionIntro } from "@/components/ui/section-intro"
import { cplTeams } from "@/lib/brand-assets"
import styles from "./logo-grid.module.css"

/** CPL team artwork in the same borderless logo cards as the gallery's logo family. */
export function CPLTeamShowcase() {
  return <section aria-labelledby="cpl-teams-heading">
    <SectionIntro tag="The character of the CPL" title={"Teams with an identity\nall their *own.*"} id="cpl-teams-heading" reveal
      subtitle="Explore the team artwork from CICA’s CPL collection. For current teams, fixtures and participation details, check CricClubs or contact the organizers." />
    <ul className={styles.logos}>
      {cplTeams.map(team => <li key={team.id}>
        <figure className={styles.logo}>
          <Image src={`/images/teams/${team.id}.webp`} alt="" width={220} height={144} />
          <figcaption>{team.name}</figcaption>
        </figure>
      </li>)}
    </ul>
  </section>
}
