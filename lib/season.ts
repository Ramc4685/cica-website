import { computeChampionStats } from "@/lib/champions"
import { tournaments } from "@/lib/content"

export interface Venue {
  id: string
  name: string
  type: "outdoor" | "indoor"
  address?: string
  mapUrl?: string
  parking?: string
  notes?: string
}

// TODO(organizers): confirm each venue's address, map link and parking notes. Baywood ground is named in the board bios (city partnership); the indoor facility name is not recorded in the repo.
export const venues: readonly Venue[] = [
  { id: "baywood", name: "Baywood ground", type: "outdoor" },
  { id: "indoor-facility", name: "Indoor facility (name to be confirmed)", type: "indoor" },
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

// TODO(organizers): add dated fixtures and events for the current season.
export const seasonEvents: readonly SeasonEvent[] = []

// TODO(organizers): add announcements (registration openings, schedule changes, results).
export const announcements: readonly Announcement[] = []

export interface FaqEntry {
  id: string
  question: string
  answer: string
}

const contactAnswer = "Please contact the organizers at organizers@cicainfo.com and they will confirm the details for your competition."

export const faq: readonly FaqEntry[] = [
  { id: "register-team", question: "How do I register a team?", answer: `Registration details differ by tournament. ${contactAnswer}` },
  { id: "registration-open", question: "Is registration open right now?", answer: `Registration dates are set per competition and are not published on this site yet. ${contactAnswer}` },
  { id: "rules", question: "Where are the tournament rules?", answer: "CICA keeps its rules and playing conditions in a shared document folder, linked from the Rules page. Confirm the edition that applies to your competition with an organizer." },
  { id: "format", question: "How many overs and players are in each match?", answer: `Overs and squad sizes can vary by tournament, so refer to the event’s current rules. ${contactAnswer}` },
  { id: "fees", question: "What does it cost to play?", answer: `Fees are confirmed by the tournament organizer. ${contactAnswer}` },
  { id: "scores", question: "Where can I find fixtures and scores?", answer: "Fixtures and scores are on CricClubs, linked from the site header and footer." },
]

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
