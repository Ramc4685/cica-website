import type { ReactNode } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { RevealHeading } from "@/components/ui/reveal-heading"

export interface PageHeroImage {
  src: string
  width: number
  height: number
  alt: string
  /** Focal point for the 4:3 cover crop, e.g. communityPhotos[n].objectPosition. */
  objectPosition?: string
}

export interface PageHeroProps {
  /** Sentence-case tag label shown with the square dot. */
  tag: string
  /** Page h1. A string uses RevealHeading markup ("\n" line breaks, *emphasis*). */
  title: ReactNode
  intro?: ReactNode
  /** Optional owner-approved photo shown beside the copy (stacks under 900px). */
  image?: PageHeroImage
  /** Surface colour: cream (default), green or ink. */
  tone?: "cream" | "green" | "ink"
  children?: ReactNode
  className?: string
}

/** Inner-page header: tag row, display h1 at --step-hero, intro and an optional photo. */
export function PageHero({ tag, title, intro, image, tone = "cream", children, className }: PageHeroProps) {
  return <header className={cn("page-hero", className)} data-tone={tone}>
    <div className="page-shell page-hero-shell" data-has-image={image ? "" : undefined}>
      <div className="page-hero-copy">
        <p className="tag-row">{tag}</p>
        {typeof title === "string" ? <RevealHeading as="h1" text={title} /> : <h1>{title}</h1>}
        {intro && <p className="page-hero-intro">{intro}</p>}
        {children}
      </div>
      {image && <figure className="page-hero-media">
        <Image src={image.src} width={image.width} height={image.height} alt={image.alt} priority
          sizes="(max-width:900px) 100vw, 45vw" className="community-photo" style={{ objectPosition: image.objectPosition }} />
      </figure>}
    </div>
  </header>
}
