"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ChevronDown, X } from "lucide-react"
import { MotionControl } from "@/components/site-motion"
import { CapsuleLink } from "@/components/ui/capsule-link"

const primary = [{ name: "Our story", href: "/about/" }, { name: "Cricket", href: "/tournaments/" }, { name: "Gallery", href: "/gallery/" }, { name: "Contact", href: "/contact/" }]
const more = [{ name: "Rules", href: "/rules/" }, { name: "Bylaws", href: "/bylaws/" }, { name: "Champions", href: "/champions/" }, { name: "Our board", href: "/board/" }, { name: "Sponsors", href: "/sponsors/" }, { name: "Email updates", href: "/join/" }]
const normalize = (path: string) => path.replace(/\/$/, "") || "/"

function MenuIcon() {
  return <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false"><path d="M3 7h20M3 13h20M3 19h20" /></svg>
}

function closeDetails(details: HTMLDetailsElement | null, returnFocus = false) {
  if (!details?.open) return
  details.open = false
  if (returnFocus) details.querySelector("summary")?.focus()
}

export function Navigation() {
  const [open, setOpen] = useState(false)
  const pathname = normalize(usePathname() || "/")
  const toggle = useRef<HTMLButtonElement>(null)
  const moreMenu = useRef<HTMLDetailsElement>(null)
  const closeMore = (returnFocus = false) => closeDetails(moreMenu.current, returnFocus)
  useEffect(() => { setOpen(false); closeDetails(moreMenu.current) }, [pathname])
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      if (open) { setOpen(false); toggle.current?.focus() }
      closeDetails(moreMenu.current, !!moreMenu.current?.contains(document.activeElement))
    }
    const onPointer = (event: PointerEvent) => {
      if (moreMenu.current && !moreMenu.current.contains(event.target as Node)) closeDetails(moreMenu.current)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPointer)
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onPointer) }
  }, [open])
  const close = () => { setOpen(false); closeMore() }
  const current = (href: string) => pathname === normalize(href) ? "page" as const : undefined
  return <header className="site-header">
    <nav className="page-shell nav-shell" aria-label="Main navigation">
      <Link href="/" className="brand" aria-label="CICA home"><Image src="/images/cica-logo-main.webp" alt="" width={52} height={52} /><span><strong>CICA</strong><small>CRICKET & COMMUNITY</small></span></Link>
      <div className="desktop-navigation">
        {primary.map(item => <Link key={item.href} href={item.href} aria-current={current(item.href)} onClick={close}>
          <span className="nav-roll"><span>{item.name}</span><span aria-hidden="true">{item.name}</span></span>
        </Link>)}
        <details ref={moreMenu} className="more-menu" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) closeMore() }}>
          <summary>Explore <ChevronDown size={14} aria-hidden="true" /></summary>
          <div className="more-menu-links">{more.map(item => <Link key={item.href} href={item.href} aria-current={current(item.href)} onClick={close}>{item.name}</Link>)}</div>
        </details>
      </div>
      <div className="nav-actions">
        <CapsuleLink href="/get-involved/" variant="outline" className="nav-cta">Get involved</CapsuleLink>
        <MotionControl compact />
        <button ref={toggle} type="button" className="mobile-toggle" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation" : "Open navigation"}>{open ? <X size={26} aria-hidden="true" /> : <MenuIcon />}</button>
      </div>
      <div id="mobile-navigation" className="mobile-navigation" hidden={!open}>
        <div className="page-shell mobile-navigation-inner">
          {[...primary, ...more].map(item => <Link key={item.href} href={item.href} aria-current={current(item.href)} onClick={close}>{item.name}</Link>)}
          <CapsuleLink href="/get-involved/" size="block" onClick={close}>Get involved</CapsuleLink>
        </div>
      </div>
    </nav>
  </header>
}
