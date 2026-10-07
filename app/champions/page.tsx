import Link from "next/link"
import { ArrowUpRight, Trophy } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { communityLinks } from "@/lib/content"
import { pageMetadata } from "@/lib/site-metadata"
export const metadata = pageMetadata("Champions archive", "Celebrate CICA tournament champions and explore recorded results from the association’s cricket history.", "/champions/")

const mainsChampions = [
  { year: "2024", team: "BloomBoys" },
  { year: "2023", team: "BloomBulls" },
  { year: "2022", team: "Peoria Marvels" },
  { year: "2021", team: "Moghals" },
  { year: "2019", team: "Moghals" },
  { year: "2018", team: "Hunters" },
  { year: "2017", team: "Bloomboys" },
  { year: "2016", team: "Bashers" },
  { year: "2015", team: "Moghals" },
  { year: "2014", team: "Bradley Bulls" },
  { year: "2013", team: "Klasic" },
  { year: "2012", team: "Sarkaar" },
]

const cicaIndoorChampions = [
  { year: "2025", team: "Hunters", runner: "Bloom Bulls" },
  { year: "2024", team: "Spartans", runner: "Bloom Bulls" },
  { year: "2023", team: "Raiders" },
  { year: "2021", team: "Spartans" },
  { year: "2019", team: "Hunters" },
  { year: "2018", team: "Moghals" },
  { year: "2017", team: "Spartans" },
  { year: "2016", team: "Spartans" },
  { year: "2015", team: "BCC" },
]

const cplIndoorChampions = [
  { year: "2025", team: "TECHIE BRAINS LEGENDS", runner: "BLOOM BARISTA BULLS" },
  { year: "2023", team: "Sysintelli Strikers", runner: "Parke Regency Thalaivas" },
]

const cplOutdoorChampions = [{ year: "2024", team: "TECHIE BRAINS LEGENDS", runner: "BLOOM EVENTS EAGLES" }]


const competitions = [
  { id: "mains", title: "CICA Mains", records: mainsChampions },
  { id: "cica-indoor", title: "CICA Indoor", records: cicaIndoorChampions },
  { id: "cpl-indoor", title: "CPL Indoor", records: cplIndoorChampions },
  { id: "cpl-outdoor", title: "CPL Outdoor", records: cplOutdoorChampions },
]
export default function ChampionsPage(){return <>
  <header className="page-hero"><div className="page-shell"><p className="eyebrow">The champions archive</p><h1>Great teams.<br />Memorable seasons.</h1><p>A celebration of the teams recorded in CICA’s tournament history.</p></div></header>
  <section className="page-shell py-16 md:py-24"><div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"><div><h2 className="section-heading">A place in CICA history.</h2><p className="mt-4 max-w-2xl leading-relaxed">This archive preserves the records available on our website. Some years and runners-up are not recorded here; the list is not a complete season history.</p></div><a href={communityLinks.scores} target="_blank" rel="noopener noreferrer" className="text-link shrink-0">Latest results on CricClubs <ArrowUpRight size={18}/></a></div>
  <Tabs defaultValue="mains"><TabsList className="grid h-auto w-full grid-cols-2 md:grid-cols-4 gap-2 p-2 bg-[#eeeae0] rounded-2xl mb-8">{competitions.map(c=><TabsTrigger key={c.id} value={c.id} className="min-h-12 whitespace-normal px-3 py-3 rounded-xl text-[#172d43] data-[state=active]:bg-white">{c.title}</TabsTrigger>)}</TabsList>{competitions.map(c=><TabsContent key={c.id} value={c.id}><div className="editorial-panel"><h3 className="text-2xl font-semibold flex items-center gap-3"><Trophy aria-hidden="true" size={24}/>{c.title}</h3><div className="overflow-x-auto mt-6"><table className="w-full text-left"><caption className="sr-only">Recorded {c.title} champions and runners-up</caption><thead><tr className="border-b"><th scope="col" className="py-4 pr-4">Year</th><th scope="col" className="py-4 pr-4">Champion</th><th scope="col" className="py-4">Runner-up</th></tr></thead><tbody>{c.records.map((record:{year:string;team:string;runner?:string})=><tr key={record.year} className="border-b last:border-0"><th scope="row" className="py-5 pr-4 font-medium">{record.year}</th><td className="py-5 pr-4 font-semibold">{record.team}</td><td className="py-5">{record.runner || "Not recorded"}</td></tr>)}</tbody></table></div></div></TabsContent>)}</Tabs>
  <div className="mt-10"><p>Have a correction or a missing result to share?</p><Link href="/contact/" className="text-link inline-flex mt-3">Help us complete the archive <ArrowUpRight size={18}/></Link></div></section></>}
