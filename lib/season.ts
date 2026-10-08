import faqFile from "@/content/faq.json"
import seasonFile from "@/content/season.json"
import sponsorsFile from "@/content/sponsors.json"
import venuesFile from "@/content/venues.json"
import { computeChampionStats } from "@/lib/champions"
import { tournaments } from "@/lib/content"
import { faqFileSchema, parseContent, seasonFileSchema, sponsorsFileSchema, venuesFileSchema } from "@/lib/content-schema"

export interface Venue {
  id: string
  name: string
  type: "outdoor" | "indoor"
  address?: string
  mapUrl?: string
  parking?: string
  notes?: string
}

/** Grounds and courts, edited through Pages CMS in content/venues.json. Cards show "Confirmed by organizers" for any address not yet entered. */
export const venues: readonly Venue[] = parseContent(venuesFileSchema, venuesFile, "venues.json").venues

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

/** Fixtures and events, and announcements are edited through Pages CMS in content/season.json, the FAQ in content/faq.json; see docs/content-editing.md. */
export const seasonEvents: readonly SeasonEvent[] = seasonContent.events
export const announcements: readonly Announcement[] = seasonContent.announcements
export const faq: readonly FaqEntry[] = parseContent(faqFileSchema, faqFile, "faq.json").faq

export interface SponsorTier {
  id: string
  name: string
  summary: string
  benefits: readonly string[]
}

/** Edited through Pages CMS in content/sponsors.json. Benefits stay empty until organizers confirm them; pricing is intentionally not published. */
export const sponsorTiers: readonly SponsorTier[] = parseContent(sponsorsFileSchema, sponsorsFile, "sponsors.json").tiers

export interface Voice {
  id: string
  quote: string
  name: string
  role?: string
}

/** Edited in content/season.json. Only quotes whose "speaker gave written consent" box is ticked are published. */
export const voices: readonly Voice[] = seasonContent.voices.filter(voice => voice.consent).map(({ consent: _consent, ...voice }) => voice)

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
