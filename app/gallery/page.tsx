import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, Camera } from "lucide-react"
import { CommunityGallery } from "@/components/community-gallery"
import { communityLinks } from "@/lib/content"
import { pageMetadata } from "@/lib/site-metadata"

export const metadata = pageMetadata("Community moments", "Explore real CICA team photographs, cricket celebrations and community moments from Central Illinois.", "/gallery/")

const logos = [
  { id: "main", name: "CICA" },
  { id: "tournaments", name: "CICA Tournaments" },
  { id: "mains", name: "CICA Mains" },
  { id: "cpl", name: "CPL" },
  { id: "mini", name: "CICA Mini" },
  { id: "indoor", name: "CICA Indoor" },
  { id: "100", name: "CICA 100" },
]

export default function GalleryPage() {
  return <>
    <header className="page-hero">
      <div className="page-shell">
        <p className="eyebrow">Community moments</p>
        <h1>More than<br />a matchday.</h1>
        <p>The teams, the celebrations, and the people who make CICA feel like a community.</p>
      </div>
    </header>
    <div className="page-shell py-16 md:py-24">
      <section aria-labelledby="photos-heading">
        <div className="mb-10 max-w-3xl">
          <p className="eyebrow">Our people. Our game.</p>
          <h2 id="photos-heading" className="section-heading">This is CICA.</h2>
          <p className="mt-4 leading-relaxed">A few moments from our community collection. Select a photograph to see it in full.</p>
        </div>
        <CommunityGallery />
      </section>
      <section className="mt-16 border-t border-[#b6bea3] pt-10" aria-labelledby="channels-heading">
        <h2 id="channels-heading" className="text-2xl font-semibold">Keep exploring.</h2>
        <p className="mt-4 max-w-2xl leading-relaxed">Find more community posts on Facebook and available cricket videos on YouTube. Some Facebook content may require you to sign in.</p>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-5">
          <a href={communityLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-link">CICA on Facebook <ArrowUpRight size={18} /></a>
          <a href={communityLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-link">CICA on YouTube <ArrowUpRight size={18} /></a>
        </div>
      </section>
      <section className="mt-20" aria-labelledby="identity-heading">
        <p className="eyebrow">Our visual identity</p>
        <h2 id="identity-heading" className="section-heading">One association.<br />Many ways to play.</h2>
        <p className="mb-8 max-w-2xl leading-relaxed">The CICA logo family, from the association identity to its tournament artwork.</p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {logos.map(logo => <figure key={logo.id} className="editorial-panel text-center">
            <Image src={`/images/cica-logo-${logo.id}.webp`} width={160} height={160} alt="" className="mx-auto h-36 w-full object-contain" />
            <figcaption className="mt-5 text-sm font-semibold">{logo.name}</figcaption>
          </figure>)}
        </div>
      </section>
      <div className="mt-14 flex items-start gap-5 border-t border-[#b6bea3] pt-10">
        <Camera className="shrink-0" size={28} aria-hidden="true" />
        <div>
          <h2 className="text-2xl font-semibold">Have a CICA moment to share?</h2>
          <p className="mt-4 max-w-2xl leading-relaxed">Contact the organizers about sharing photos or a community story. Please only share material you have permission to publish, including permission from the people pictured.</p>
          <Link href="/contact/" className="text-link mt-5 inline-flex">Share with the organizers <ArrowUpRight size={18} /></Link>
        </div>
      </div>
    </div>
  </>
}
