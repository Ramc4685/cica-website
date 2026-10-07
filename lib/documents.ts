// CICA governing documents. Google Drive stays the source of truth: the site renders the text as
// HTML (lib/bylaws.ts, lib/rules/*) and links every file back to Drive. Google Docs also get a PDF
// copy in public/documents/, refreshed with `pnpm sync:documents` (see docs/documents.md). Keep the
// Google Doc ids and localPdf paths in step with the list in scripts/sync-documents.mjs.
// Dates are the Drive "modified" dates read on 2026-10-07 unless a field says otherwise.

export type DocumentKind = "google-doc" | "docx" | "pdf"

export interface OfficialDocument {
  id: string
  title: string
  /** One factual line about what the document covers. */
  summary: string
  kind: DocumentKind
  driveId: string
  /** Public Drive / Docs link (anyone with the link can view). */
  url: string
  /** ISO date the source was last updated in Drive. */
  updated: string
  /** Revision label printed inside the document itself, when it differs from the Drive date. */
  revisionNote?: string
  /** Season or competition the document applies to. */
  appliesTo: string
  /** Path of the PDF copy in public/ (Google Docs only, written by scripts/sync-documents.mjs). */
  localPdf?: string
  /** Owned by a third party: link only, never re-hosted. */
  external?: boolean
  /** Site page that renders this document as HTML. */
  pageHref?: string
}

export const rulesFolderUrl = "https://drive.google.com/drive/folders/16mFxdlNfcbK8_1_z5CNhLpFD5WPh4Asy"

const docUrl = (id: string) => `https://docs.google.com/document/d/${id}/view`
const fileUrl = (id: string) => `https://drive.google.com/file/d/${id}/view`

export const officialDocuments = {
  bylaws: {
    id: "bylaws",
    title: "CICA Bylaws",
    summary: "The association’s governing document: purpose, membership, officers, board, committees, meetings, finances and disciplinary procedures.",
    kind: "google-doc",
    driveId: "1v6EnSnmrLFJKiB6InjcRulaQI3VA_eFTQvDvKLPTXsg",
    url: docUrl("1v6EnSnmrLFJKiB6InjcRulaQI3VA_eFTQvDvKLPTXsg"),
    updated: "2025-06-05",
    appliesTo: "The association",
    localPdf: "/documents/cica-bylaws.pdf",
    pageHref: "/bylaws/",
  },
  generalRules: {
    id: "general-rules",
    title: "CICA Playing Conditions and Rules (General Rules)",
    summary: "Code of conduct, registration, playing conditions, grace periods, points, grounds, discipline, protests, rescheduling, field restrictions, tie breakers, umpires and captains.",
    kind: "docx",
    driveId: "1WSnu-Rk5c890ExCgqbj3Wi4DQ99O9s6P",
    url: fileUrl("1WSnu-Rk5c890ExCgqbj3Wi4DQ99O9s6P"),
    updated: "2026-09-11",
    revisionNote: "Footer reads “CICA 2024 · Last revised: Jan 29, 2024”",
    appliesTo: "All CICA tournaments",
    pageHref: "/rules/#general-rules",
  },
  indoor2025: {
    id: "indoor-2025",
    title: "CICA Indoor 2025: format and rules",
    summary: "Ten-team format, roster, overs, bowl-outs, game time, BTT ground rules, fielding zones, ceiling zones and umpiring for indoor play.",
    kind: "docx",
    driveId: "1nlGAKy92qOtTH4nAQgt3STNDYzsqTvht",
    url: fileUrl("1nlGAKy92qOtTH4nAQgt3STNDYzsqTvht"),
    updated: "2025-01-10",
    appliesTo: "CICA Indoor 2025",
    pageHref: "/rules/indoor/#cica-indoor-2025",
  },
  cplIndoor2025: {
    id: "cpl-indoor-2025",
    title: "2025 CPL Indoor Tournament Rules",
    summary: "Eight-team round robin, playoffs, match format, playoff eligibility, game conduct, impact players, umpiring and tie breakers.",
    kind: "google-doc",
    driveId: "1blb7YtKfVpT5sExNoPigijqwRVXS5BZpSJAfhdiiV-8",
    url: docUrl("1blb7YtKfVpT5sExNoPigijqwRVXS5BZpSJAfhdiiV-8"),
    updated: "2025-03-16",
    appliesTo: "CPL Indoor 2025",
    localPdf: "/documents/cpl-indoor-2025-rules.pdf",
    pageHref: "/rules/indoor/#cpl-indoor-2025",
  },
  iccT20: {
    id: "icc-t20-2025",
    title: "ICC Men’s T20I Playing Conditions 2025",
    summary: "The ICC playing conditions that CICA’s rules modify. Anything CICA does not change follows these.",
    kind: "pdf",
    driveId: "1PhbVZo2hPdf-Z4Zw3HhiaxyLyrjISps3",
    url: fileUrl("1PhbVZo2hPdf-Z4Zw3HhiaxyLyrjISps3"),
    updated: "2025-09-06",
    appliesTo: "Published by the ICC",
    external: true,
  },
} as const satisfies Record<string, OfficialDocument>

export const officialDocumentList: readonly OfficialDocument[] = [
  officialDocuments.generalRules,
  officialDocuments.indoor2025,
  officialDocuments.cplIndoor2025,
  officialDocuments.bylaws,
  officialDocuments.iccT20,
]

const longDate = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })

/** "June 5, 2025" from an ISO date, formatted in UTC so server and client agree. */
export function formatDocumentDate(iso: string): string {
  return longDate.format(new Date(`${iso}T00:00:00Z`))
}
