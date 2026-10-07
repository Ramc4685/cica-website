"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { MotionControl } from "@/components/site-motion"
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react"

const primary = [{name:"Our story",href:"/about"},{name:"Cricket",href:"/tournaments"},{name:"Community",href:"/get-involved"},{name:"Contact",href:"/contact"}]
const more = [{name:"Rules & bylaws",href:"/rules"},{name:"Champions",href:"/champions"},{name:"Our board",href:"/board"},{name:"Sponsors",href:"/sponsors"},{name:"Gallery",href:"/gallery"},{name:"Email updates",href:"/join"}]

export function Navigation() {
  const [open,setOpen]=useState(false)
  const pathname=(usePathname() || "/").replace(/\/$/, "") || "/"
  const toggle=useRef<HTMLButtonElement>(null)
  const moreMenu=useRef<HTMLDetailsElement>(null)
  useEffect(()=>{setOpen(false);if(moreMenu.current)moreMenu.current.open=false},[pathname])
  useEffect(()=>{const escape=(event:KeyboardEvent)=>{if(event.key==="Escape"){if(open){setOpen(false);toggle.current?.focus()}if(moreMenu.current?.open){moreMenu.current.open=false;moreMenu.current.querySelector("summary")?.focus()}}};document.addEventListener("keydown",escape);return()=>document.removeEventListener("keydown",escape)},[open])
  const navLink=(item:{name:string;href:string})=><Link key={item.href} href={item.href} aria-current={pathname===item.href?"page":undefined} onClick={()=>{setOpen(false);if(moreMenu.current)moreMenu.current.open=false}}>{item.name}</Link>
  return <header className="site-header"><nav className="page-shell nav-shell" aria-label="Main navigation"><Link href="/" className="brand" aria-label="CICA home"><Image src="/images/cica-logo-main.webp" alt="" width={58} height={58} priority /><span><strong>CICA</strong><small>CRICKET & COMMUNITY</small></span></Link><div className="desktop-navigation">{primary.map(navLink)}<details ref={moreMenu} className="more-menu"><summary>Explore <ChevronDown size={14} aria-hidden="true" /></summary><div className="more-menu-links">{more.map(navLink)}</div></details></div><Link href="/get-involved" className="premium-button nav-cta">Get involved <ArrowUpRight size={17} aria-hidden="true" /></Link><button ref={toggle} className="mobile-toggle" onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open?"Close navigation":"Open navigation"}>{open?<X aria-hidden="true" />:<Menu aria-hidden="true" />}</button></nav><div className="site-motion-toolbar page-shell"><MotionControl /></div><div id="mobile-navigation" className="mobile-navigation" hidden={!open}><div className="page-shell">{[...primary,...more].map(navLink)}<Link className="premium-button" href="/get-involved" onClick={()=>setOpen(false)}>Get involved <ArrowUpRight size={18} aria-hidden="true" /></Link></div></div></header>
}
