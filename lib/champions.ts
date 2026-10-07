export type CompetitionId = "mains" | "cica-indoor" | "cpl-indoor" | "cpl-outdoor" | "mini" | "challengers"

export interface ChampionRecord {
  season: number
  champion: string
  runnerUp?: string
  notes?: string
}

export interface Competition {
  id: CompetitionId
  title: string
  records: readonly ChampionRecord[]
}

/** Records are newest first. Years missing from a list are not recorded on this site. */
export const competitions: readonly Competition[] = [
  {
    id: "mains",
    title: "CICA Mains",
    records: [
      { season: 2024, champion: "BloomBoys" },
      { season: 2023, champion: "Bloom Bulls" },
      { season: 2022, champion: "Peoria Marvels" },
      { season: 2021, champion: "Moghals" },
      { season: 2019, champion: "Moghals" },
      { season: 2018, champion: "Hunters" },
      { season: 2017, champion: "BloomBoys" },
      { season: 2016, champion: "Bashers" },
      { season: 2015, champion: "Moghals" },
      { season: 2014, champion: "Bradley Bulls" },
      { season: 2013, champion: "Klasic" },
      { season: 2012, champion: "Sarkaar" },
    ],
  },
  {
    id: "cica-indoor",
    title: "CICA Indoor",
    records: [
      { season: 2025, champion: "Hunters", runnerUp: "Bloom Bulls" },
      { season: 2024, champion: "Spartans", runnerUp: "Bloom Bulls" },
      { season: 2023, champion: "Raiders" },
      { season: 2021, champion: "Spartans" },
      { season: 2019, champion: "Hunters" },
      { season: 2018, champion: "Moghals" },
      { season: 2017, champion: "Spartans" },
      { season: 2016, champion: "Spartans" },
      { season: 2015, champion: "BCC" },
    ],
  },
  {
    id: "cpl-indoor",
    title: "CPL Indoor",
    records: [
      { season: 2025, champion: "Techie Brains Legends", runnerUp: "Bloom Barista Bulls" },
      { season: 2023, champion: "Sysintelli Strikers", runnerUp: "Parke Regency Thalaivas" },
    ],
  },
  {
    id: "cpl-outdoor",
    title: "CPL Outdoor",
    records: [{ season: 2024, champion: "Techie Brains Legends", runnerUp: "Bloom Events Eagles" }],
  },
  {
    id: "mini",
    title: "Mini Tournament",
    // TODO(organizers): supply recorded Mini Tournament champions (season, champion, runner-up).
    records: [],
  },
  {
    id: "challengers",
    title: "Challengers",
    // TODO(organizers): supply recorded Challengers champions (season, champion, runner-up).
    records: [],
  },
]

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
