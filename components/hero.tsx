import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, MapPin } from "lucide-react"

export function Hero() {
  return <section className="community-hero page-shell">
    <div className="hero-copy">
      <p className="eyebrow"><span className="status-dot" /> YOUR LOCAL CRICKET COMMUNITY</p>
      <h1>Cricket brings<br />us <em>together.</em></h1>
      <p className="hero-description">A shared love of the game. A place to belong. Discover cricket, friendship, and community with CICA in Bloomington–Normal.</p>
      <div className="hero-actions"><Link className="hero-cta" href="/get-involved"><span className="cta-icon"><ArrowUpRight aria-hidden="true" /></span><span className="cta-label">Find your place</span></Link><a className="text-link" href="https://cricclubs.com/CICA" target="_blank" rel="noopener noreferrer">Fixtures & scores <ArrowUpRight size={17} aria-hidden="true" /></a></div>
      <p className="hero-location"><MapPin size={15} aria-hidden="true" /> Rooted in Central Illinois. Since 1998.</p>
    </div>
    <div className="hero-art" aria-hidden="true">
      <div className="hero-art-label">THE GAME IS BETTER<br />WHEN WE&apos;RE TOGETHER.</div>
      <svg className="cricket-illustration" viewBox="0 0 600 650" fill="none"><path d="M45 425C132 355 95 209 199 128C309 42 497 116 548 243C601 375 522 548 370 583C221 618 103 548 45 425Z" fill="#edcf73"/><path d="M77 487C144 516 422 624 524 330M106 512C219 585 476 603 546 367" stroke="#13294b" strokeWidth="2"/><ellipse cx="302" cy="498" rx="144" ry="40" fill="#13294b" opacity=".1"/><g transform="translate(161 248) rotate(-28)"><rect x="54" y="0" width="24" height="162" rx="12" fill="#13294b"/><rect x="23" y="120" width="86" height="231" rx="30" fill="#f8f5ed" stroke="#13294b" strokeWidth="4"/><path d="M45 151H87M45 166H87M45 181H87" stroke="#c4aa6a" strokeWidth="3"/></g><g transform="translate(380 307)"><path d="M0 0V185M26 0V185M52 0V185" stroke="#13294b" strokeWidth="11" strokeLinecap="round"/><path d="M-6 -8H58" stroke="#13294b" strokeWidth="9" strokeLinecap="round"/></g><circle cx="395" cy="225" r="44" fill="#b44f40"/><path d="M369 190C402 204 421 229 418 262M377 186C410 200 429 225 426 255" stroke="#fff5e8" strokeWidth="2" strokeDasharray="5 4"/><path d="M463 124L477 151L507 156L483 177L488 207L463 193L436 207L441 177L419 156L450 151Z" fill="#f8f5ed" stroke="#13294b" strokeWidth="2"/></svg>
      <div className="hero-emblem"><Image src="/images/cica-logo-main.webp" width={158} height={158} alt="" priority /></div>
      <div className="hero-format-seals"><Image src="/images/cica-logo-cpl.webp" width={68} height={68} alt="" /><Image src="/images/cica-logo-indoor.webp" width={68} height={68} alt="" /></div><div className="hero-art-caption"><span>ONE COMMUNITY.</span><span>PLENTY OF WAYS TO BELONG. ↗</span></div>
    </div>
  </section>
}
