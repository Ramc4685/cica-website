declare const expect: jest.Expect;
declare const it: jest.It;
import { competitions, computeChampionStats, titlesForTeam, type Competition } from "@/lib/champions"

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
