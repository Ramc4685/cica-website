import Image from "next/image"
import { cplTeams } from "@/lib/brand-assets"

export function TeamLogo({ team }: { team: (typeof cplTeams)[number] }) {
  return <figure className="rounded-2xl border border-border bg-white p-4"><div className="relative flex h-36 items-center justify-center"><Image src={`/images/teams/${team.id}.webp`} alt="" width={220} height={144} className="h-full w-full object-contain" /></div><figcaption className="mt-4 text-center text-sm font-semibold leading-snug">{team.name}</figcaption></figure>
}
export function CPLTeamShowcase() {
  return <section aria-labelledby="cpl-teams-heading"><p className="eyebrow">The character of the CPL</p><h2 id="cpl-teams-heading" className="section-heading">Teams with an identity<br />all their own.</h2><p className="mb-8 max-w-2xl leading-relaxed text-muted-foreground">Explore the team artwork from CICA&apos;s CPL collection. For current teams, fixtures and participation details, check CricClubs or contact the organizers.</p><div className="grid grid-cols-2 gap-4 md:grid-cols-4">{cplTeams.map(team=><TeamLogo key={team.id} team={team}/>)}</div></section>
}
