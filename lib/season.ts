import seasonFile from "@/content/season.json"
import { computeChampionStats } from "@/lib/champions"
import { tournaments } from "@/lib/content"
import { parseContent, seasonFileSchema } from "@/lib/content-schema"

export interface Venue {
  id: string
  name: string
  type: "outdoor" | "indoor"
  address?: string
  mapUrl?: string
  parking?: string
  notes?: string
}

// Grounds named in the CICA General Rules ("Playing Area") and the 2025 indoor documents
// (lib/documents.ts). TODO(organizers): add street addresses and map links for the three outdoor
// grounds; the documents do not state them, so the cards show "Confirmed by organizers" until then.
const bttAddress = "4101 Wicker Rd, Bloomington, IL 61704"

export const venues: readonly Venue[] = [
  { id: "eastview", name: "Eastview Cricket Field", type: "outdoor", notes: "Under the control of Eastview Christian Church. It is private property: use it only as directed and according to the church’s rules." },
  { id: "normal", name: "Normal cricket ground", type: "outdoor", notes: "Under the control of the City of Normal and CICA. Use it according to CICA’s rules and those of the Normal Park District." },
  { id: "baywood", name: "Baywood cricket ground", type: "outdoor", notes: "Under the control of CICA, with Bloomington Parks rules. Captains remind players about the speed limit in the Baywood neighborhood." },
  {
    id: "btt", name: "Bloomington Table Tennis (BTT)", type: "indoor", address: bttAddress,
    mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(bttAddress)}`,
    parking: "Teams and spectators use the designated parking areas.",
    notes: "Indoor turf for the 2025 indoor tournaments. Every player signs the BTT waiver before playing. No smoking on the premises, and the tennis courts are off limits.",
  },
]

export interface SeasonEvent {
  id: string
  title: string
  /** ISO date (YYYY-MM-DD). */
  date: string
  competitionId?: string
  venueId?: string
  summary?: string
  url?: string
}

export interface Announcement {
  id: string
  title: string
  /** ISO date (YYYY-MM-DD). */
  date: string
  body: string
  url?: string
}

export interface FaqEntry {
  id: string
  question: string
  answer: string
}

const seasonContent = parseContent(seasonFileSchema, seasonFile, "season.json")

/** Fixtures and events, announcements and FAQ are edited through Pages CMS in content/season.json; see docs/content-editing.md. */
export const seasonEvents: readonly SeasonEvent[] = seasonContent.events
export const announcements: readonly Announcement[] = seasonContent.announcements
export const faq: readonly FaqEntry[] = seasonContent.faq

export interface SponsorTier {
  id: string
  name: string
  summary: string
  benefits: readonly string[]
}

// TODO(organizers): confirm the benefits for each tier. Pricing is intentionally not published.
export const sponsorTiers: readonly SponsorTier[] = [
  { id: "premium", name: "Premium partner", summary: "Lead placement across the CICA site.", benefits: [] },
  { id: "cpl-team", name: "CPL team partner", summary: "A team in the Cricket Premier League carries the partner’s name.", benefits: [] },
  { id: "matchday", name: "Matchday & community supporter", summary: "Support matchdays and community events.", benefits: [] },
]

export interface Voice {
  id: string
  quote: string
  name: string
  role?: string
}

// TODO(organizers): add testimonials only with the speaker's written consent.
export const voices: readonly Voice[] = []

export interface Metric {
  id: string
  value: string
  label: string
}

export function getMetrics(): readonly Metric[] {
  const stats = computeChampionStats()
  return [
    { id: "founded", value: "1998", label: "Founded" },
    { id: "competitions", value: String(tournaments.length), label: "Competitions" },
    { id: "seasons", value: String(stats.seasonsRecorded), label: "Seasons recorded" },
    { id: "titles", value: String(stats.titlesAwarded), label: "Titles awarded" },
  ]
}
