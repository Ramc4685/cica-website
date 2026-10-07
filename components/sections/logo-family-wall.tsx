import type { CSSProperties } from "react"
import { cicaIdentities } from "@/lib/brand-assets"
import styles from "./logo-family-wall.module.css"

const tones = ["blue", "clear", "yellow"] as const
type Tone = (typeof tones)[number]
const tileSrc = (id: string, tone: Tone) =>
  tone === "clear" ? `/images/cica-logo-${id}.webp` : `/images/logos-family/cica-logo-${id}-${tone}.webp`
const names = cicaIdentities.map(identity => identity.name)
const caption = `The CICA family of identities: ${names.slice(0, -1).join(", ")} and ${names.at(-1)}, each in its transparent, blue and yellow treatments.`

/** About page brand wall. Desktop: one column per identity. Mobile: three looping rows, one per treatment. */
export function LogoFamilyWall() {
  return <section className={styles.frame} aria-label="CICA identities">
    <figure className={styles.figure}>
      <div className={styles.wall} data-wall aria-hidden="true">
        {tones.map((tone, row) => <div key={tone} className={styles.row}>
          {/* The track repeats once so the mobile loop is seamless; the copy is hidden on desktop. */}
          {[0, 1].map(copy => <div key={copy} className={styles.track} data-copy={copy ? "" : undefined}>
            {cicaIdentities.map(({ id }, column) => <span key={id} className={styles.tile} data-tile={copy ? undefined : tone} data-tone={tone}
              style={{ "--col": column, "--row": row } as CSSProperties}>
              <img src={tileSrc(id, tone)} alt="" width={tone === "clear" ? 589 : 360} height={tone === "clear" ? 640 : 360} loading="lazy" decoding="async" />
            </span>)}
          </div>)}
        </div>)}
      </div>
      <figcaption className="sr-only">{caption}</figcaption>
    </figure>
  </section>
}
