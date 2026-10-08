"use client"

import { useEffect, useState } from "react"
import { readOrganizerMode, writeOrganizerMode } from "@/components/organizer-edit-link"

/** Opt-in switch for the organizer edit links. Preference is stored only in this browser. */
export function OrganizerToggle() {
  const [on, setOn] = useState(false)
  useEffect(() => { setOn(readOrganizerMode()) }, [])
  return <label className="organizer-toggle">
    <input type="checkbox" checked={on} onChange={event => { setOn(event.target.checked); writeOrganizerMode(event.target.checked) }} />
    <span>Show edit links on this device</span>
  </label>
}
