import Image from "next/image"
import { CPLTeamShowcase } from "@/components/team-logo"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { communityLinks, tournaments } from "@/lib/content"
import { pageMetadata } from "@/lib/site-metadata"
export const metadata = pageMetadata("Cricket tournaments", "Explore CICA’s indoor and outdoor cricket tournaments, find scores and ask about upcoming participation.", "/tournaments/")
export default function TournamentsPage() {
  return <><header className="page-hero"><div className="page-shell"><p className="eyebrow">On the field</p><h1>Different formats.<br />The same love of cricket.</h1><p>Explore CICA’s indoor and outdoor competitions, then connect with an organizer about the right next step.</p><a href={communityLinks.scores} target="_blank" rel="noopener noreferrer" className="premium-button mt-6">Fixtures & scores on CricClubs <ArrowUpRight size={18} /></a></div></header>
  <div className="page-shell py-16 md:py-24 space-y-16">{["Outdoor","Indoor"].map(setting=><section key={setting} id={setting.toLowerCase()}><p className="eyebrow">{setting === "Outdoor" ? "Beyond the boundary" : "Keep the game going"}</p><h2 className="section-heading">{setting} cricket</h2><div className="grid gap-6 md:grid-cols-2 mt-8">{tournaments.filter(t=>t.setting===setting).map(t=><article key={t.id} id={t.id} className="editorial-panel flex gap-5 items-start scroll-mt-28"><Image src={t.logo} alt="" width={72} height={72} className="shrink-0 w-16 h-16 object-contain" /><div><h3 className="text-2xl font-semibold">{t.name}</h3><p className="mt-3 leading-relaxed">{t.description}</p><Link href="/contact/" className="text-link inline-flex mt-5">Ask about participation <ArrowUpRight size={16} /></Link></div></article>)}</div></section>)}
  <CPLTeamShowcase />
  <section className="editorial-panel"><p className="eyebrow">Before you register</p><h2 className="section-heading">Let’s get you the right details.</h2><p className="max-w-3xl mt-5 leading-relaxed">Dates, venues, fees, eligibility and registration arrangements depend on the competition. Check the tournament listing on CricClubs and confirm details with the organizers before making plans. Current event rules take precedence over general format descriptions.</p><div className="flex flex-wrap gap-4 mt-7"><Link href="/get-involved/" className="premium-button">New to CICA? Start here <ArrowUpRight size={18} /></Link><Link href="/rules/" className="premium-button secondary">Rules & documents</Link></div></section></div></>
}
