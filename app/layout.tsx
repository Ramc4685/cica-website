import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
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
        url: "/images/cica-logo-main.jpg",
        width: 1200,
        height: 630,
        alt: "CICA Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Central Illinois Cricket Association - CICA",
    description: "Developing cricket in Bloomington/Normal, Illinois since 1998",
    images: ["/images/cica-logo-main.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
