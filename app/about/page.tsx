import Link from "next/link"
import { ArrowUpRight, HeartHandshake, Trophy, Users } from "lucide-react"
import { pageMetadata } from "@/lib/site-metadata"
import { communityLinks } from "@/lib/content"

export const metadata = pageMetadata("About our community", "Learn about CICA’s story, purpose and community in Bloomington–Normal and Central Illinois.", "/about/")

export default function AboutPage() {
  return <>
    <header className="page-hero"><div className="page-shell"><p className="eyebrow">Our story</p><h1>One game.<br />A community of connections.</h1><p>Cricket gives us a reason to come together. The people make us want to stay.</p></div></header>
    <section className="page-shell py-16 md:py-24 grid gap-12 lg:grid-cols-2">
      <div><p className="eyebrow">Rooted in Central Illinois</p><h2 className="section-heading">A place for the love of cricket.</h2><p className="mt-6 text-lg leading-relaxed">Founded in 1998, the Central Illinois Cricket Association brings organized cricket to Bloomington–Normal and the surrounding community. Local players, organizers and supporters have shaped its story together.</p><p className="mt-5 leading-relaxed">From outdoor tournaments to indoor competitions, CICA creates opportunities to play, compete and connect. Our purpose remains close to home: develop cricket and build a welcoming community around it.</p><Link href="/get-involved/" className="premium-button mt-8">Find your place at CICA <ArrowUpRight size={18} /></Link></div>
      <div className="editorial-panel space-y-8"><p className="eyebrow">What brings us together</p>{[{icon: Users,title:"Community",copy:"Friendships that begin at a match and extend beyond the boundary."},{icon: Trophy,title:"The game",copy:"Teamwork, fair play and the shared excitement of cricket."},{icon: HeartHandshake,title:"Contributing",copy:"The players, families, volunteers and supporters who help make it happen."}].map(({icon: Icon,title,copy})=><div key={title} className="flex gap-4"><Icon className="shrink-0 mt-1" aria-hidden="true" /><div><h3 className="text-xl font-semibold">{title}</h3><p className="mt-2 leading-relaxed">{copy}</p></div></div>)}</div>
    </section>
    <section className="page-shell pb-20"><div className="editorial-panel grid gap-8 md:grid-cols-2"><div><p className="eyebrow">People & purpose</p><h2 className="section-heading">Built by people who care.</h2><p className="mt-5 leading-relaxed">Meet the organizers behind CICA, explore our tournament history, or read the association’s bylaws.</p><Link href="/board/" className="text-link mt-6 inline-flex">Meet our leadership <ArrowUpRight size={18} /></Link></div><div className="space-y-5"><h3 className="text-xl font-semibold">Association bylaws</h3><p className="leading-relaxed">The bylaws document describes association governance and operations. Open the document directly, or contact the organizers if you cannot access it.</p><a href={communityLinks.bylaws} target="_blank" rel="noopener noreferrer" className="premium-button secondary">Read the bylaws <ArrowUpRight size={18} /></a><Link href="/contact/" className="text-link flex">Ask an organizer</Link></div></div></section>
  </>
}
