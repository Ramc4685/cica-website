import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, Facebook, Youtube, MessageCircle } from "lucide-react"
import { CapsuleLink } from "@/components/ui/capsule-link"
import { communityLinks } from "@/lib/content"

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/about/", label: "Our story" },
      { href: "/board/", label: "Our board" },
      { href: "/tournaments/", label: "Tournaments" },
      { href: "/tournaments/#where-we-play", label: "Where we play" },
      { href: "/champions/", label: "Champions" },
      { href: "/gallery/", label: "Gallery" },
    ],
  },
  {
    title: "Play",
    links: [
      { href: "/rules/", label: "Rules" },
      { href: "/bylaws/", label: "Bylaws" },
      { href: communityLinks.scores, label: "Fixtures & scores", external: true },
    ],
  },
  {
    title: "Get involved",
    links: [
      { href: "/get-involved/", label: "Get involved" },
      { href: "/sponsors/", label: "Sponsors" },
      { href: "/join/", label: "Email updates" },
      { href: "/contact/", label: "Contact us" },
    ],
  },
] as const

const socials = [
  { href: communityLinks.facebook, label: "CICA on Facebook", Icon: Facebook },
  { href: communityLinks.youtube, label: "CICA on YouTube", Icon: Youtube },
  { href: communityLinks.whatsapp, label: "CICA WhatsApp community", Icon: MessageCircle },
] as const

export function Footer() {
  return <footer className="site-footer" data-tone="ink">
    <div className="footer-cta">
      <div className="footer-arc" aria-hidden="true" />
      <div className="page-shell footer-cta-inner">
        <h2 className="footer-line">Ready for the season? <em>Join CICA.</em></h2>
        <CapsuleLink href="/get-involved/" tone="cream">Get involved</CapsuleLink>
      </div>
    </div>
    <div className="page-shell">
      <div className="footer-top">
        <div className="footer-brand">
          <Link href="/" className="brand" aria-label="CICA home">
            <Image src="/images/logos-sm/cica-logo-main.webp" alt="" width={64} height={64} />
            <span><strong>CICA</strong><small>Central Illinois Cricket Association</small></span>
          </Link>
          <p>Bringing cricket and community together in Bloomington–Normal, Illinois.</p>
          <div className="social-links">
            {socials.map(({ href, label, Icon }) => <a key={href} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} (opens in a new tab)`}><Icon size={20} aria-hidden="true" /></a>)}
          </div>
        </div>
        <nav className="footer-columns" aria-label="Footer">
          {columns.map(column => <div key={column.title}>
            <h3>{column.title}</h3>
            <ul>
              {column.links.map(link => <li key={link.href}>
                {"external" in link
                  ? <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label} <ArrowUpRight size={14} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
                  : <Link href={link.href}>{link.label}</Link>}
              </li>)}
            </ul>
          </div>)}
        </nav>
        <div className="footer-contact">
          <h3>Let&apos;s connect</h3>
          <p>Questions about playing, helping out, or supporting the community?</p>
          <a href={communityLinks.email}>organizers@cicainfo.com</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Central Illinois Cricket Association</span>
        <Link href="/privacy/">Privacy &amp; data</Link>
        <span>Rooted in community since 1998.</span>
      </div>
    </div>
  </footer>
}
