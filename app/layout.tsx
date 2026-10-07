import type React from "react"
import type { Metadata } from "next"
import { Goudy_Bookletter_1911, Karla } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

const display = Goudy_Bookletter_1911({ subsets: ["latin"], weight: "400", variable: "--font-display", display: "swap" })
const body = Karla({ subsets: ["latin"], variable: "--font-body", display: "swap" })

export const metadata: Metadata = {
  metadataBase: new URL("https://cicainfo.com"),
  title: "Central Illinois Cricket Association - CICA",
  description:
    "Promoting cricket and developing the sport in Bloomington/Normal, Illinois since 1998. Join our tournaments, events, and cricket community.",
  keywords:
    "cricket, Illinois, Bloomington, Normal, CICA, tournaments, sports, community, CPL, indoor cricket, outdoor cricket",
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
  alternates: { canonical: "https://cicainfo.com/" }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>
          <a href="#main-content" className="skip-link">Skip to content</a>
          <Navigation />
          <main id="main-content" className="min-h-screen" tabIndex={-1}>{children}</main>
          <Footer />
      </body>
    </html>
  )
}
