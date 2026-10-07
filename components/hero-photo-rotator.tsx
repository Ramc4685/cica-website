"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { heroPhotos } from "@/lib/community-photos"
import { useSiteMotion } from "@/components/site-motion"

const total = heroPhotos.length

/**
 * One hero photo card. Each owner-approved photo is shown whole (contain over a blurred
 * backdrop, see docs/community-imagery.md). It advances on its own only while site motion
 * runs and nobody is hovering or focused inside it; only user-initiated changes are announced.
 */
export function HeroPhotoRotator() {
  const [selected, setSelected] = useState(0)
  const [displayed, setDisplayed] = useState(0)
  const [previous, setPrevious] = useState(0)
  const [loaded, setLoaded] = useState<ReadonlySet<number>>(() => new Set())
  const [hovering, setHovering] = useState(false)
  const [focused, setFocused] = useState(false)
  const [announcement, setAnnouncement] = useState("")
  const { motionEnabled } = useSiteMotion()
  const animate = motionEnabled && !hovering && !focused
  useEffect(() => {
    if (!animate) return
    const timer = window.setInterval(() => setSelected(index => (index + 1) % total), 6000)
    return () => window.clearInterval(timer)
  }, [animate, selected])
  useEffect(() => {
    if (loaded.has(selected) && selected !== displayed) {
      setPrevious(displayed)
      setDisplayed(selected)
    }
  }, [loaded, selected, displayed])
  function step(direction: 1 | -1) {
    const next = (selected + direction + total) % total
    setSelected(next)
    setAnnouncement(`Photo ${next + 1} of ${total}: ${heroPhotos[next].alt}`)
  }
  const frames = [...new Set([previous, displayed, selected])]
  return <div className="growlio-hero-image hero-photo-rotator" role="region" aria-label="CICA community photos"
    onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}
    onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}>
    {frames.map(index => <div key={heroPhotos[index].id} aria-hidden={index !== displayed}
      className={`hero-photo-frame ${heroPhotos[index].width > heroPhotos[index].height ? "is-landscape" : ""} ${index === displayed ? "is-visible" : ""}`}>
      <Image src={heroPhotos[index].src} alt="" fill sizes="(max-width:760px) 90vw, 42vw" className="hero-photo-backdrop" />
      <div className="hero-photo-full-view"><Image src={heroPhotos[index].src} alt={heroPhotos[index].alt}
        fill priority={index === 0} sizes="(max-width:760px) 90vw, 42vw" className="hero-rotating-photo"
        onLoad={() => setLoaded(current => current.has(index) ? current : new Set([...current, index]))} /></div>
    </div>)}
    <p className="hero-fact-pill">Since 1998</p>
    <div className="hero-photo-controls" role="group" aria-label="Photo controls">
      <button type="button" aria-label="Previous hero photo" onClick={() => step(-1)}><ArrowLeft size={17} aria-hidden="true" /></button>
      <span className="hero-photo-count"><span className="sr-only">Photo {displayed + 1} of {total}</span><span aria-hidden="true">{displayed + 1} / {total}</span></span>
      <button type="button" aria-label="Next hero photo" onClick={() => step(1)}><ArrowRight size={17} aria-hidden="true" /></button>
    </div>
    <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
  </div>
}
