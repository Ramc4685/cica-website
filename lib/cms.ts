/** Pages CMS deep links. Change the repo, branch or editor host here and nowhere else. */
export const CMS_BASE = "https://app.pagescms.org/Ramc4685/cica-website/main"

/** Keep in step with the `content` and `media` names in .pages.yml (a test checks this). */
export const CMS_SECTIONS = [
  { name: "champions", kind: "content", label: "Champions", hint: "Winners, runners-up and team photos for each season." },
  { name: "tournaments", kind: "content", label: "Tournaments", hint: "Registration status, deadlines, links and format." },
  { name: "season", kind: "content", label: "News, events and FAQ", hint: "Announcements, upcoming events and answers to common questions." },
  { name: "photos", kind: "content", label: "Gallery photos", hint: "Photos shown in the gallery and on the home page." },
  { name: "champion-photos", kind: "media", label: "Champion photo uploads", hint: "The upload folder for champion team photos." },
  { name: "community-photos", kind: "media", label: "Community photo uploads", hint: "The upload folder for gallery photos." },
] as const

export type CmsSectionName = (typeof CMS_SECTIONS)[number]["name"]

export const cmsEditorUrl = CMS_BASE

export function cmsSectionUrl(name: CmsSectionName): string {
  const section = CMS_SECTIONS.find(item => item.name === name)
  return `${CMS_BASE}/${section?.kind ?? "content"}/${name}`
}

/** localStorage key set from /admin/ to show "Edit this section" links on this device. */
export const ORGANIZER_STORAGE_KEY = "cica-organizer"
export const ORGANIZER_EVENT = "cica-organizer-change"
