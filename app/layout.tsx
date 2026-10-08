import type React from "react"
import type { Metadata } from "next"
import { Goudy_Bookletter_1911, Inter_Tight } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { MotionProvider } from "@/components/site-motion"
import { communityLinks } from "@/lib/content"
import { siteUrl } from "@/lib/site-metadata"

const display = Goudy_Bookletter_1911({ subsets: ["latin"], weight: "400", variable: "--font-display", display: "swap" })
const body = Inter_Tight({ subsets: ["latin"], variable: "--font-body", display: "swap" })

export const metadata: Metadata = {
  metadataBase: new URL("https://cicainfo.com"),
  title: "Central Illinois Cricket Association - CICA",
  description:
    "Promoting cricket and developing the sport in Bloomington/Normal, Illinois since 1998. Join our tournaments, events, and cricket community.",
  keywords:
    "cricket, Illinois, Bloomington, Normal, CICA, tournaments, sports, community, CPL, indoor cricket, outdoor cricket",
  authors: [{ name: "Marvy Labs", url: "https://marvy-labs.com" }],
  creator: "Marvy Labs",
  openGraph: {
    title: "Central Illinois Cricket Association - CICA",
    description: "Developing cricket in Bloomington/Normal, Illinois since 1998",
    type: "website",
    locale: "en_US",
    url: "https://cicainfo.com",
    siteName: "CICA",
    images: [
      {
        url: "/images/cica-social.webp",
        width: 1200,
        height: 630,
        alt: "Cricket brings us together — Central Illinois Cricket Association",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Central Illinois Cricket Association - CICA",
    description: "Developing cricket in Bloomington/Normal, Illinois since 1998",
    images: ["/images/cica-social.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

// Facts already published on the site: name, founding year, crest, area and official channels.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  name: "Central Illinois Cricket Association",
  alternateName: "CICA",
  url: `${siteUrl}/`,
  foundingDate: "1998",
  sport: "Cricket",
  logo: `${siteUrl}/images/cica-logo-main.webp`,
  email: communityLinks.email.replace(/^mailto:/, ""),
  areaServed: "Bloomington–Normal, Illinois",
  sameAs: [communityLinks.facebook, communityLinks.youtube, communityLinks.scores],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }} />
        <MotionProvider>
          <a href="#main-content" className="skip-link">Skip to content</a>
          <Navigation />
          <main id="main-content" tabIndex={-1}>{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  )
}
