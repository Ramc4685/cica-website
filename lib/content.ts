import tournamentsFile from "@/content/tournaments.json"
import { parseContent, tournamentsFileSchema } from "@/lib/content-schema"

export const communityLinks = {
  scores: "https://cricclubs.com/CICA",
  rules: "https://drive.google.com/drive/folders/16mFxdlNfcbK8_1_z5CNhLpFD5WPh4Asy",
  bylaws: "https://docs.google.com/document/d/1v6EnSnmrLFJKiB6InjcRulaQI3VA_eFTQvDvKLPTXsg/view",
  facebook: "https://www.facebook.com/cicacric/",
  youtube: "https://www.youtube.com/@CICA-CRIC",
  whatsapp: "https://chat.whatsapp.com/Ij7GEOEkGJK9DCY2LDPFj8",
  email: "mailto:organizers@cicainfo.com",
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
