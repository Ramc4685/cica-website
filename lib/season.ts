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

// Rules-backed answers cite their source document (lib/documents.ts):
// general = CICA Playing Conditions and Rules; indoor2025 = CICA Indoor 2025; cplIndoor2025 = 2025 CPL Indoor Tournament Rules.
export const faq: readonly FaqEntry[] = [
  { id: "register-team", question: "How do I register a team?", answer: `Registration details differ by tournament. A team is registered only once it has submitted its registration and paid the tournament fee. ${contactAnswer}` }, // general: Registration Fees
  { id: "registration-open", question: "Is registration open right now?", answer: `Registration dates are set per competition and are not published on this site yet. ${contactAnswer}` },
  { id: "rules", question: "Where are the tournament rules?", answer: "The Rules page reproduces CICA’s General Rules, the 2025 indoor rules and the bylaws, with a link to each source document in CICA’s Google Drive rules folder. If the site and the Drive document ever differ, the Drive document applies." },
  { id: "format", question: "How many overs are in each match?", answer: "Outdoor overs are set before each tournament, and no game is shorter than 10 overs unless CICA approves it. The 2025 indoor tournaments (CICA Indoor and CPL Indoor) used 13 overs per team." }, // general: Length of the Game; indoor2025; cplIndoor2025
  { id: "fees", question: "How are fees paid?", answer: "CICA does not accept cash. The rules name Chase QuickPay to paycica@cicainfo.com for payments such as the $20 player replacement fee. Each team’s entrance fee is set by CICA for the tournament; ask the organizers for the amount." }, // general: Registration Fees
  { id: "replace-player", question: "Can we add or replace a player during the season?", answer: "Yes. You can add players until your roster reaches the tournament’s limit. After that, each replacement costs $20 and the new player can play once the fee is paid. Replacing a player who has not played a game is free. A removed player cannot be added back that season, and CICA needs notice at least 1 hour before the game." }, // general: Registration Fees; Registering a New Player/Replacement of Player
  { id: "playoff-eligibility", question: "How many games must a player play to be eligible for the playoffs?", answer: "Under the General Rules, at least 2 games with the same team before the postseason. CICA Indoor 2025 required 1 game. CPL Indoor 2025 required 1 match for youth players and 2 for everyone else." }, // general: Registering a New Player; indoor2025: Roster; cplIndoor2025: Player Requirements
  { id: "complaints", question: "How do we raise a complaint or protest?", answer: "Email organizers@cicainfo.com in writing within 5 days of the incident, and say which CICA rule you believe was broken. Ask for confirmation that your email was received." }, // general: Protest/Complaint
  { id: "scores", question: "Where can I find fixtures and scores?", answer: "Every match is scored in the CricClubs app. Fixtures and scores are on CricClubs, linked from the site header and footer." }, // general: Score sheets
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
