"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { heroPhotos } from "@/lib/community-photos"
import { useSiteMotion } from "@/components/site-motion"

export function HeroPhotoRotator() {
  const [selected, setSelected] = useState(0)
  const [displayed, setDisplayed] = useState(0)
  const [previous, setPrevious] = useState(0)
  const [loaded, setLoaded] = useState<ReadonlySet<number>>(() => new Set())
  const [hovering, setHovering] = useState(false)
  const [focused, setFocused] = useState(false)
  const { motionEnabled } = useSiteMotion()
  const animate = motionEnabled && !hovering && !focused
  useEffect(() => {
    if (!animate) return
    const timer = window.setInterval(() => setSelected(index => (index + 1) % heroPhotos.length), 6000)
    return () => window.clearInterval(timer)
  }, [animate, selected])
  useEffect(() => {
    if (loaded.has(selected) && selected !== displayed) {
      setPrevious(displayed)
      setDisplayed(selected)
    }
  }, [loaded, selected, displayed])
  const frames = [...new Set([previous, displayed, selected])]
  return <div className="growlio-hero-image hero-photo-rotator" role="region" aria-label="CICA community photos"
    onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}
    onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}>
    {frames.map(index => <div key={heroPhotos[index].id} aria-hidden={index !== displayed}
      className={`hero-photo-frame ${heroPhotos[index].width > heroPhotos[index].height ? "is-landscape" : ""} ${index === displayed ? "is-visible" : ""}`}>
      <Image src={heroPhotos[index].src} alt="" aria-hidden="true" fill sizes="(max-width:760px) 90vw, 42vw" className="hero-photo-backdrop" />
      <div className="hero-photo-full-view"><Image src={heroPhotos[index].src} alt={heroPhotos[index].alt}
      aria-hidden={index !== displayed} fill priority={index === 0} sizes="(max-width:760px) 90vw, 42vw"
      className="hero-rotating-photo"
      onLoad={() => setLoaded(current => current.has(index) ? current : new Set([...current, index]))} /></div>
    </div>)}
    <span className="hero-image-badge">LOCAL ROOTS. SHARED PASSION.</span>
    <div className="hero-image-brand"><Image src="/images/cica-logo-main.webp" width={120} height={140} alt="CICA" /><span>THE GAME IS BETTER<br />WHEN WE&apos;RE TOGETHER.</span></div>
    <div className="hero-photo-controls"><span>Photo {displayed + 1} of {heroPhotos.length}</span><div>
      <button type="button" aria-label="Previous hero photo" onClick={() => setSelected(index => (index - 1 + heroPhotos.length) % heroPhotos.length)}><ArrowLeft size={17} aria-hidden="true" /></button>
      <button type="button" aria-label="Next hero photo" onClick={() => setSelected(index => (index + 1) % heroPhotos.length)}><ArrowRight size={17} aria-hidden="true" /></button>
    </div></div>
  </div>
}
