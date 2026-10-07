"use client"

import { useRef, useState, type KeyboardEvent } from "react"

/**
 * WAI-ARIA tabs keyboard model: arrows move (and wrap), Home/End jump to the ends.
 * Returns null for keys the tablist does not handle.
 */
export function nextTabIndex(key: string, current: number, count: number): number | null {
  if (count <= 0) return null
  switch (key) {
    case "ArrowRight":
    case "ArrowDown":
      return (current + 1) % count
    case "ArrowLeft":
    case "ArrowUp":
      return (current - 1 + count) % count
    case "Home":
      return 0
    case "End":
      return count - 1
    default:
      return null
  }
}

/** Roving-tabindex state for a tablist whose selection follows focus. */
export function useRovingTabs(count: number, initial = 0) {
  const [active, setActive] = useState(initial)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const next = nextTabIndex(event.key, active, count)
    if (next === null) return
    event.preventDefault()
    setActive(next)
    tabRefs.current[next]?.focus()
  }
  const registerTab = (index: number) => (node: HTMLButtonElement | null) => { tabRefs.current[index] = node }
  return { active, setActive, onKeyDown, registerTab }
}
