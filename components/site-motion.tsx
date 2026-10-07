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

export function MotionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [paused, setPaused] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(preference.matches)
    setPaused(preference.matches)
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
    const sections = document.querySelectorAll<HTMLElement>("main > section, main > div > section")
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("motion-entered")
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.08 })
    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [motionEnabled, pathname])
  return <SiteMotionContext.Provider value={{ motionEnabled, paused, toggleMotion: () => setPaused(value => !value), reducedMotion, ready }}>{children}</SiteMotionContext.Provider>
}

export function useSiteMotion() {
  const state = useContext(SiteMotionContext)
  if (!state) throw new Error("useSiteMotion must be used inside MotionProvider")
  return state
}

export function MotionControl({ className = "" }: { className?: string }) {
  const { paused, toggleMotion, ready, reducedMotion } = useSiteMotion()
  return <button type="button" className={`motion-control ${className}`} onClick={toggleMotion} disabled={!ready || reducedMotion} aria-label={reducedMotion ? "Motion disabled by your reduced motion preference" : paused ? "Resume motion across the site" : "Pause motion across the site"}>{paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}<span>{reducedMotion ? "Reduced motion" : paused ? "Resume motion" : "Pause motion"}</span></button>
}
