import { competitions, computeChampionStats, type ChampionRecord, type Competition, type CompetitionId } from "@/lib/champions"
import { tournaments, type RegistrationStatus, type Tournament } from "@/lib/content"

// lib/content tournament ids match lib/champions competition ids except for the Mains.
const competitionIdByTournament: Record<string, CompetitionId> = { "cica-mains": "mains" }

export function competitionForTournament(tournamentId: string, list: readonly Competition[] = competitions): Competition | undefined {
  const id = competitionIdByTournament[tournamentId] ?? tournamentId
  return list.find(competition => competition.id === id)
}

export function tournamentForCompetition(competitionId: CompetitionId): Tournament | undefined {
  return tournaments.find(tournament => (competitionIdByTournament[tournament.id] ?? tournament.id) === competitionId)
}

/** The <8KB copy of a logo under /images/logos-sm/ (same filename). */
export function smallLogo(src: string): string {
  return src.replace(/^\/images\//, "/images/logos-sm/")
}

export function ordinal(n: number): string {
  const tens = n % 100
  if (tens >= 11 && tens <= 13) return `${n}th`
  return `${n}${({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th"}`
}

export interface ChampionHighlights {
  latest: ChampionRecord | null
  /** Short factual pills derived only from the recorded seasons. */
  pills: string[]
}

export function buildChampionHighlights(competition: Competition): ChampionHighlights {
  const latest = competition.records[0] ?? null
  if (!latest) return { latest: null, pills: [] }
  const { titlesByTeam } = computeChampionStats([competition])
  const pills = [`${latest.season} champion`]
  if (latest.runnerUp) pills.push(`Runner-up: ${latest.runnerUp}`)
  const latestTitles = titlesByTeam.find(entry => entry.team === latest.champion)?.titles ?? 1
  if (latestTitles > 1) pills.push(`${ordinal(latestTitles)} ${competition.title} title`)
  const [leader, second] = titlesByTeam
  // Only name a leader when the lead is outright, and skip it when it repeats the latest champion.
  if (leader && leader.titles > 1 && leader.team !== latest.champion && (!second || leader.titles > second.titles)) {
    pills.push(`Most titles: ${leader.team} ×${leader.titles}`)
  }
  const seasons = competition.records.length
  pills.push(`${seasons} ${seasons === 1 ? "season" : "seasons"} recorded`)
  return { latest, pills }
}

export interface RegistrationLabel {
  label: string
  /** True when the status is confirmed by organizers (not a placeholder). */
  confirmed: boolean
}

export function registrationLabel(status: RegistrationStatus, deadline?: string): RegistrationLabel {
  switch (status) {
    case "open":
      return { label: deadline ? `Registration open until ${formatIsoDate(deadline)}` : "Registration open", confirmed: true }
    case "upcoming":
      return { label: "Registration opening soon", confirmed: true }
    case "closed":
      return { label: "Registration closed", confirmed: true }
    default:
      return { label: "Registration details from organizers", confirmed: false }
  }
}

/** Formats YYYY-MM-DD in UTC so server and client always agree on the day. */
export function formatIsoDate(iso: string, options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" }): string {
  const date = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" }).format(date)
}
