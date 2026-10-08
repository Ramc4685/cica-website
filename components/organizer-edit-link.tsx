"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { cmsSectionUrl, SUGGEST_UPDATE_HREF, ORGANIZER_EVENT, ORGANIZER_STORAGE_KEY, type CmsSectionName } from "@/lib/cms"

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

/** Low-key "Suggest an update" link for everyone, plus an "Edit this section" link only on devices where an organizer opted in at /admin/ (added after mount). */
export function OrganizerEditLink({ section, label }: { section: CmsSectionName; label: string }) {
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    const sync = () => setEnabled(readOrganizerMode())
    sync()
    window.addEventListener(ORGANIZER_EVENT, sync)
    window.addEventListener("storage", sync)
    return () => { window.removeEventListener(ORGANIZER_EVENT, sync); window.removeEventListener("storage", sync) }
  }, [])
  return <p className="organizer-edit">
    <Link href={SUGGEST_UPDATE_HREF} aria-label={`Suggest an update to ${label}`}>Suggest an update</Link>
    {enabled && <a href={cmsSectionUrl(section)} target="_blank" rel="noopener noreferrer" aria-label={`Edit ${label} in the content editor (opens in a new tab)`}>
      Edit this section <ArrowUpRight size={14} aria-hidden="true" />
    </a>}
  </p>
}
