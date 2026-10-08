import championsFile from "@/content/champions.json"
import { championsFileSchema, parseContent } from "@/lib/content-schema"

export type CompetitionId = "mains" | "cica-indoor" | "cpl-indoor" | "cpl-outdoor" | "mini" | "challengers"

export interface ChampionRecord {
  season: number
  champion: string
  runnerUp?: string
  notes?: string
  photo?: { src: string; alt: string }
}

export interface Competition {
  id: CompetitionId
  title: string
  records: readonly ChampionRecord[]
}

const championsContent = parseContent(championsFileSchema, championsFile, "champions.json")

/**
 * ISO date (YYYY-MM-DD) organizers last checked the archive; edited in content/champions.json. While
 * unset, the showcase says which season the records run through instead of inventing an update date.
 */
export const recordsUpdated: string | undefined = championsContent.recordsUpdated || undefined

/** Each competition's records sorted newest season first, so editors can add seasons in any order. */
export function newestSeasonFirst(list: readonly Competition[]): Competition[] {
  return list.map(competition => ({ ...competition, records: [...competition.records].sort((a, b) => b.season - a.season) }))
}

/** Records are newest first (the first record is the current champion). Edited through Pages CMS in content/champions.json; see docs/content-editing.md. */
export const competitions: readonly Competition[] = newestSeasonFirst(championsContent.competitions)

export interface TitleCount {
  team: string
  titles: number
}

export interface ChampionStats {
  /** Seasons with a recorded champion. */
  seasonsRecorded: number
  /** Distinct calendar years across all competitions. */
  yearsRecorded: number
  /** Total championship titles recorded. */
  titlesAwarded: number
  latestSeason: number | null
  /** Teams sorted by titles (desc), then name. */
  titlesByTeam: readonly TitleCount[]
}

export function computeChampionStats(list: readonly Competition[] = competitions): ChampionStats {
  const counts = new Map<string, number>()
  const years = new Set<number>()
  let seasons = 0
  let latest: number | null = null
  for (const competition of list) {
    for (const record of competition.records) {
      seasons += 1
      years.add(record.season)
      counts.set(record.champion, (counts.get(record.champion) ?? 0) + 1)
      if (latest === null || record.season > latest) latest = record.season
    }
  }
  const titlesByTeam = [...counts]
    .map(([team, titles]) => ({ team, titles }))
    .sort((a, b) => b.titles - a.titles || a.team.localeCompare(b.team))
  return { seasonsRecorded: seasons, yearsRecorded: years.size, titlesAwarded: seasons, latestSeason: latest, titlesByTeam }
}

export function titlesForTeam(team: string, list: readonly Competition[] = competitions): number {
  return computeChampionStats(list).titlesByTeam.find(entry => entry.team === team)?.titles ?? 0
}
