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

// TODO(organizers): add factual descriptions for Mini Tournament and Challengers; confirm registrationStatus, deadline, registration URL and format (overs, ball type, squad size, rules PDF) for every competition.
const tbcFormat: TournamentFormat = { overs: "tbc", ballType: "tbc", squadSize: "tbc" }

export const tournaments: readonly Tournament[] = [
  { id: "cica-mains", name: "CICA Mains", setting: "Outdoor", logo: "/images/cica-logo-mains.webp", description: "CICA’s flagship outdoor competition, bringing local teams together on the field. Champions are recorded from 2012.", registrationStatus: "tbc", format: tbcFormat },
  { id: "cpl-outdoor", name: "CPL Outdoor", setting: "Outdoor", logo: "/images/cica-logo-cpl.webp", description: "The outdoor edition of the Cricket Premier League, with teams named for their sponsors.", registrationStatus: "tbc", format: tbcFormat },
  { id: "mini", name: "Mini Tournament", setting: "Outdoor", logo: "/images/cica-logo-mini.webp", description: "Another way for teams across the CICA community to compete.", registrationStatus: "tbc", format: tbcFormat },
  { id: "challengers", name: "Challengers", setting: "Outdoor", logo: "/images/cica-logo-tournaments.webp", description: "A tournament in CICA’s outdoor cricket calendar.", registrationStatus: "tbc", format: tbcFormat },
  { id: "cica-indoor", name: "CICA Indoor", setting: "Indoor", logo: "/images/cica-logo-indoor.webp", description: "Cricket indoors, keeping the community connected beyond the outdoor season. Champions are recorded from 2015.", registrationStatus: "tbc", format: tbcFormat },
  { id: "cpl-indoor", name: "CPL Indoor", setting: "Indoor", logo: "/images/cica-logo-cpl.webp", description: "The indoor edition of the Cricket Premier League, with teams named for their sponsors.", registrationStatus: "tbc", format: tbcFormat },
]
