import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { pageMetadata } from "@/lib/site-metadata"
export const metadata = pageMetadata("Our leadership", "Meet CICA’s directors and organizing team, supporting cricket and community in Central Illinois.", "/board/")

const boardMembers = [
  {
    name: "RamC Venkatasamy",
    role: "Director",
    bio: "One of CICA's oldest organizers still actively contributing since 2012. Though not a founding member, RamC has been instrumental in transforming CICA through key innovations and facility acquisitions.",
    image: "/images/board/ramc-venkatasamy.jpg",
    specialties: ["Ground Management", "Tournament Innovation", "Facility Development"],
    achievements: [
      "Long-standing service and leadership since 2012",
      "Established multiple cricket divisions to enhance competitive structure",
      "Modernized tournament play by transitioning to the 20-over format",
      "Spearheaded the acquisition of Baywood ground through a city partnership",
      "Pioneered and managed the CPL player auctions",
      "Secured indoor facilities, enabling year-round cricket for the community"
    ],
    playerRole: "All-rounder"
  },
  {
    name: "Ayaskant Rout",
    role: "Director",
    bio: "Dedicated community builder and tournament organizer who has been helping CICA grow since 2019. Focused on expanding cricket participation and organizing competitive events.",
    image: "/images/board/ayaskant-rout.jpg",
    specialties: ["Community Building", "Tournament Organization"],
    achievements: [
      "Contributing since 2019",
      "Community engagement leader",
      "Tournament coordination"
    ],
    playerRole: "All-rounder"
  },
  {
    name: "Senthil Krishnan",
    role: "CICA Organizing Committee",
    bio: "Tournament organization specialist who joined the organizing team in 2021. Focuses on scheduling and coordinating cricket tournaments to ensure smooth operations.",
    image: "/images/board/senthil-krishnan.jpg",
    specialties: ["Tournament Organization", "Scheduling"],
    achievements: [
      "Organizing since 2021",
      "Tournament scheduling expert",
      "Event coordination"
    ],
    playerRole: "Organizer"
  }
]


export default function BoardPage(){return <><header className="page-hero"><div className="page-shell"><p className="eyebrow">Our leadership</p><h1>The people<br />behind the game.</h1><p>Meet the directors and organizers who help bring CICA’s community together.</p></div></header><section className="page-shell py-16 md:py-24 space-y-8">{boardMembers.map(member=><article key={member.name} className="editorial-panel grid gap-8 md:grid-cols-[220px_1fr]"><div><div aria-hidden="true" className="w-24 h-24 rounded-full bg-[#eae7da] text-[#172d43] flex items-center justify-center text-3xl font-semibold mb-6">{member.name.split(" ").map(n=>n[0]).join("")}</div><p className="eyebrow">{member.role}</p><h2 className="text-2xl font-semibold">{member.name}</h2><p className="mt-3">{member.playerRole}</p></div><div><p className="text-lg leading-relaxed">{member.bio}</p><div className="flex flex-wrap gap-2 mt-5">{member.specialties.map(s=><span key={s} className="rounded-full border px-3 py-1 text-sm">{s}</span>)}</div><details className="mt-7 border-t pt-5"><summary className="cursor-pointer font-semibold py-2">Community contributions</summary><ul className="list-disc pl-5 mt-4 space-y-2 leading-relaxed">{member.achievements.map(a=><li key={a}>{a}</li>)}</ul></details></div></article>)}<div className="pt-8 text-center"><h2 className="section-heading">You can help shape what comes next.</h2><p className="mt-5">Interested in volunteering or helping with a tournament? Start a conversation.</p><Link href="/get-involved/" className="premium-button inline-flex mt-7">Get involved <ArrowUpRight size={18}/></Link></div></section></>}
