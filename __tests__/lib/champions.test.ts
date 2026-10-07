declare const expect: jest.Expect;
declare const it: jest.It;
import { competitions, computeChampionStats, newestSeasonFirst, titlesForTeam, type Competition } from "@/lib/champions"

const sample: Competition[] = [
  { id: "mains", title: "A", records: [{ season: 2024, champion: "X" }, { season: 2023, champion: "Y" }, { season: 2022, champion: "X" }] },
  { id: "mini", title: "B", records: [{ season: 2024, champion: "Z" }] },
  { id: "challengers", title: "C", records: [] },
]

describe("computeChampionStats", () => {
  it("counts titles, seasons, years and latest season", () => {
    const stats = computeChampionStats(sample)
    expect(stats.titlesAwarded).toBe(4)
    expect(stats.seasonsRecorded).toBe(4)
    expect(stats.yearsRecorded).toBe(3)
    expect(stats.latestSeason).toBe(2024)
    expect(stats.titlesByTeam[0]).toEqual({ team: "X", titles: 2 })
    expect(stats.titlesByTeam.map(t => t.team)).toEqual(["X", "Y", "Z"])
  })

  it("handles empty competitions", () => {
    const stats = computeChampionStats([{ id: "mini", title: "M", records: [] }])
    expect(stats).toMatchObject({ titlesAwarded: 0, latestSeason: null, titlesByTeam: [] })
  })

  it("titlesForTeam returns 0 for unknown teams", () => {
    expect(titlesForTeam("X", sample)).toBe(2)
    expect(titlesForTeam("Nobody", sample)).toBe(0)
  })

  it("uses one canonical spelling in the real archive", () => {
    const names = computeChampionStats(competitions).titlesByTeam.map(t => t.team)
    expect(names).not.toContain("Bloomboys")
    expect(names).not.toContain("BloomBulls")
    expect(names.filter(n => n.toLowerCase().startsWith("techie"))).toEqual(["Techie Brains Legends"])
  })
})

describe("newestSeasonFirst", () => {
  it("orders each competition's seasons newest first whatever order they were entered in", () => {
    const shuffled: Competition[] = [
      { id: "mains", title: "A", records: [{ season: 2019, champion: "Old" }, { season: 2025, champion: "New" }, { season: 2020, champion: "Mid" }] },
      { id: "mini", title: "B", records: [] },
    ]
    const sorted = newestSeasonFirst(shuffled)
    expect(sorted[0].records.map(r => r.season)).toEqual([2025, 2020, 2019])
    expect(sorted[0].records[0].champion).toBe("New")
    expect(sorted[1].records).toEqual([])
    expect(shuffled[0].records[0].season).toBe(2019)
  })

  it("keeps the real archive newest first", () => {
    for (const competition of competitions) {
      const seasons = competition.records.map(r => r.season)
      expect(seasons).toEqual([...seasons].sort((a, b) => b - a))
    }
  })
})
