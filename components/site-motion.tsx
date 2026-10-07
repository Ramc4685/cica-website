"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { Pause, Play } from "lucide-react"
import { usePathname } from "next/navigation"

interface SiteMotionState {
  motionEnabled: boolean
  paused: boolean
  toggleMotion: () => void
  reducedMotion: boolean
  ready: boolean
}
const SiteMotionContext = createContext<SiteMotionState | null>(null)
const STORAGE_KEY = "cica-motion"
/** Elements that reveal once as they scroll into view (see globals.css "Motion"). */
const REVEAL_TARGETS = "main > section, main > div > section, .reveal-heading"

function readStoredPause() {
  try { return window.localStorage.getItem(STORAGE_KEY) === "paused" } catch { return false }
}
function storePause(paused: boolean) {
  try { window.localStorage.setItem(STORAGE_KEY, paused ? "paused" : "running") } catch { /* storage blocked: keep the in-memory choice */ }
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [paused, setPaused] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(preference.matches)
    setPaused(preference.matches || readStoredPause())
    setReady(true)
    const update = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches)
      if (event.matches) setPaused(true)
    }
    preference.addEventListener("change", update)
    return () => preference.removeEventListener("change", update)
  }, [])
  const motionEnabled = ready && !paused && !reducedMotion
  useEffect(() => {
    document.documentElement.dataset.motion = motionEnabled ? "running" : "paused"
    return () => { delete document.documentElement.dataset.motion }
  }, [motionEnabled])
  useEffect(() => {
    if (!motionEnabled) return
    const targets = [...document.querySelectorAll<HTMLElement>(REVEAL_TARGETS)]
      .filter(target => !target.classList.contains("motion-entered") && !target.classList.contains("motion-static"))
    const seen = new WeakSet<Element>()
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const target = entry.target
        // Anything already on screen at hydration stays put, so server-rendered text never flashes away.
        if (!seen.has(target)) {
          seen.add(target)
          if (entry.isIntersecting && !target.classList.contains("motion-waiting")) {
            target.classList.add("motion-static")
            observer.unobserve(target)
            return
          }
          target.classList.add("motion-waiting")
        }
        if (entry.isIntersecting) {
          target.classList.replace("motion-waiting", "motion-entered")
          observer.unobserve(target)
        }
      })
    }, { threshold: 0.08 })
    targets.forEach(target => observer.observe(target))
    return () => observer.disconnect()
  }, [motionEnabled, pathname])
  const toggleMotion = () => setPaused(value => { storePause(!value); return !value })
  return <SiteMotionContext.Provider value={{ motionEnabled, paused, toggleMotion, reducedMotion, ready }}>{children}</SiteMotionContext.Provider>
}

export function useSiteMotion() {
  const state = useContext(SiteMotionContext)
  if (!state) throw new Error("useSiteMotion must be used inside MotionProvider")
  return state
}

/**
 * Global pause/resume control for site motion (WCAG 2.2.2).
 * `compact` renders a 44px icon button with a tooltip; the label stays available to assistive tech.
 */
export function MotionControl({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  const { paused, toggleMotion, ready, reducedMotion } = useSiteMotion()
  const label = reducedMotion ? "Motion off (reduced motion preference)" : "Pause site motion"
  const visibleText = reducedMotion ? "Reduced motion" : paused ? "Resume motion" : "Pause motion"
  return <button type="button" className={`motion-control ${className}`} data-compact={compact || undefined} onClick={toggleMotion}
    disabled={!ready || reducedMotion} aria-pressed={paused} aria-label={label} title={compact ? visibleText : undefined}>
    {paused ? <Play size={compact ? 17 : 15} aria-hidden="true" /> : <Pause size={compact ? 17 : 15} aria-hidden="true" />}
    {!compact && <span aria-hidden="true">{visibleText}</span>}
  </button>
}
