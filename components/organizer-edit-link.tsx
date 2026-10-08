"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { cmsSectionUrl, ORGANIZER_EVENT, ORGANIZER_STORAGE_KEY, type CmsSectionName } from "@/lib/cms"

export function readOrganizerMode(): boolean {
  try { return window.localStorage.getItem(ORGANIZER_STORAGE_KEY) === "1" } catch { return false }
}

export function writeOrganizerMode(on: boolean) {
  try {
    if (on) window.localStorage.setItem(ORGANIZER_STORAGE_KEY, "1")
    else window.localStorage.removeItem(ORGANIZER_STORAGE_KEY)
  } catch { /* storage blocked: the toggle simply has no effect */ }
  window.dispatchEvent(new Event(ORGANIZER_EVENT))
}

/** Small "Edit this section" link, shown only on devices where an organizer opted in at /admin/. Renders nothing until after mount. */
export function OrganizerEditLink({ section, label }: { section: CmsSectionName; label: string }) {
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    const sync = () => setEnabled(readOrganizerMode())
    sync()
    window.addEventListener(ORGANIZER_EVENT, sync)
    window.addEventListener("storage", sync)
    return () => { window.removeEventListener(ORGANIZER_EVENT, sync); window.removeEventListener("storage", sync) }
  }, [])
  if (!enabled) return null
  return <p className="organizer-edit">
    <a href={cmsSectionUrl(section)} target="_blank" rel="noopener noreferrer" aria-label={`Edit ${label} in the content editor (opens in a new tab)`}>
      Edit this section <ArrowUpRight size={14} aria-hidden="true" />
    </a>
  </p>
}
