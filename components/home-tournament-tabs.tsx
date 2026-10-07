"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { tournaments } from "@/lib/content"
export function HomeTournamentTabs(){const [setting,setSetting]=useState("Outdoor");return <div className="home-tournament-tabs"><div className="format-filter" aria-label="Filter tournaments">{["Outdoor","Indoor"].map(name=><button key={name} onClick={()=>setSetting(name)} aria-pressed={setting===name}>{name} cricket <ArrowUpRight size={16} aria-hidden="true"/></button>)}</div><div className="home-tournament-grid">{tournaments.filter(t=>t.setting===setting).map((t,i)=><article key={t.id} className={`home-tournament-card tournament-tone-${i%3}`}><div className="tournament-art"><Image src={t.logo} alt="" width={230} height={230} className="object-contain"/><span aria-hidden="true">✳</span></div><div className="tournament-card-copy"><p>{setting.toUpperCase()} / CICA</p><h3>{t.name}</h3><p>{t.description}</p><Link href={`/tournaments/#${t.id}`}>Explore this format <ArrowUpRight size={20} aria-hidden="true"/></Link></div></article>)}</div></div>}
