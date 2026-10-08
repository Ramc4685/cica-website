import siteFile from "@/content/site.json"
import tournamentsFile from "@/content/tournaments.json"
import { parseContent, siteFileSchema, tournamentsFileSchema } from "@/lib/content-schema"

const site = parseContent(siteFileSchema, siteFile, "site.json")

/** Edited through Pages CMS in content/site.json ("Site links"). */
export const communityLinks = {
  scores: site.scores,
  rules: site.rules,
  bylaws: site.bylaws,
  facebook: site.facebook,
  youtube: site.youtube,
  whatsapp: site.whatsapp,
  email: `mailto:${site.email}`,
}

export type RegistrationStatus = "open" | "closed" | "upcoming" | "tbc"

export interface TournamentFormat {
  overs?: number | "tbc"
  ballType?: "leather" | "tennis" | "tbc"
  squadSize?: number | "tbc"
  /** Public link to the competition's rules document. */
  rulesPdf?: string
}

export interface Tournament {
  id: string
  name: string
  setting: "Outdoor" | "Indoor"
  logo: string
  description: string
  registrationStatus: RegistrationStatus
  registrationDeadline?: string
  registrationUrl?: string
  format: TournamentFormat
}

/** Edited through Pages CMS in content/tournaments.json; see docs/content-editing.md. */
export const tournaments: readonly Tournament[] = parseContent(tournamentsFileSchema, tournamentsFile, "tournaments.json").tournaments
