/** Pages CMS deep links. Change the repo, branch or editor host here and nowhere else. */
export const CMS_BASE = "https://app.pagescms.org/Ramc4685/cica-website/main"

/** Keep in step with the `content` and `media` names in .pages.yml (a test checks this). */
export const CMS_SECTIONS = [
  { name: "season", kind: "content", label: "Season, events and news", hint: "Use this for announcements, upcoming events and testimonials." },
  { name: "tournaments", kind: "content", label: "Tournaments", hint: "Use this for registration status, deadlines, links and match format." },
  { name: "champions", kind: "content", label: "Results (champions)", hint: "Use this to add a season's winner, runner-up and team photo." },
  { name: "photos", kind: "content", label: "Photos", hint: "Use this to add gallery and home page photos." },
  { name: "sponsors", kind: "content", label: "Sponsors", hint: "Use this to add or update sponsors, their logos and sponsorship options." },
  { name: "teams", kind: "content", label: "CPL teams", hint: "Use this to add or rename a Cricket Premier League team and its logo." },
  { name: "venues", kind: "content", label: "Venues", hint: "Use this for grounds and courts: addresses, map links, parking and ground rules." },
  { name: "board", kind: "content", label: "Board and organizers", hint: "Use this when a director or organizer joins, leaves or changes role." },
  { name: "site", kind: "content", label: "Site links", hint: "Use this when the scores page, Facebook, YouTube, WhatsApp or organizers' email changes." },
  { name: "faq", kind: "content", label: "FAQ", hint: "Use this to add or correct answers to common questions." },
  { name: "champion-photos", kind: "media", label: "Champion photo uploads", hint: "Use this to browse or replace uploaded champion team photos." },
  { name: "community-photos", kind: "media", label: "Gallery photo uploads", hint: "Use this to browse or replace uploaded gallery photos." },
  { name: "logos", kind: "media", label: "Logo uploads", hint: "Use this to browse or replace uploaded team and sponsor logos." },
] as const

export type CmsSectionName = (typeof CMS_SECTIONS)[number]["name"]

export const cmsEditorUrl = CMS_BASE

export function cmsSectionUrl(name: CmsSectionName): string {
  const section = CMS_SECTIONS.find(item => item.name === name)
  return `${CMS_BASE}/${section?.kind ?? "content"}/${name}`
}

/** Where "Suggest an update" links go: the contact form with its subject prefilled. */
export const SUGGEST_UPDATE_HREF = "/contact/?topic=update#contact-form"

/** localStorage key set from /admin/ to show "Edit this section" links on this device. */
export const ORGANIZER_STORAGE_KEY = "cica-organizer"
export const ORGANIZER_EVENT = "cica-organizer-change"
