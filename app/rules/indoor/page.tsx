import { CapsuleLink } from "@/components/ui/capsule-link"
import { PageHero } from "@/components/ui/page-hero"
import { SectionIntro } from "@/components/ui/section-intro"
import { officialDocuments } from "@/lib/documents"
import { bttVenue, cicaIndoor2025Sections, cplIndoor2025Sections } from "@/lib/rules/indoor"
import { venues } from "@/lib/season"
import { pageMetadata } from "@/lib/site-metadata"
import { DocumentSource } from "../_components/official-documents"
import { DocumentToc, RuleSectionView } from "../_components/rule-text"
import styles from "../_components/documents.module.css"

export const metadata = pageMetadata("Indoor rules", "CICA Indoor 2025 and CPL Indoor 2025 rules: format, overs, fielding zones, ceiling zones, bowl-outs, umpiring and the BTT ground rules.", "/rules/indoor/")

const indoorDoc = officialDocuments.indoor2025
const cplDoc = officialDocuments.cplIndoor2025
const btt = venues.find(venue => venue.id === "btt")

export default function IndoorRulesPage() {
  return <>
    <PageHero tag="Indoor rules · 2025" title={"Cricket under\nthe *roof.*"}
      intro={`The 2025 indoor tournaments were played on the turf at ${bttVenue.name}, ${bttVenue.address}. Every player must sign the BTT waiver before playing.`}>
      <div className={styles.heroActions}>
        <CapsuleLink href={bttVenue.waiverUrl} external>Sign the BTT waiver</CapsuleLink>
        {btt?.mapUrl && <CapsuleLink href={btt.mapUrl} external variant="outline">Open BTT in maps</CapsuleLink>}
        <CapsuleLink href="/rules/" variant="outline">All rules</CapsuleLink>
      </div>
    </PageHero>

    <div id="cica-indoor-2025" className={`${styles.sectionTight} page-shell`}>
      <header className={styles.layoutHeader}>
        <SectionIntro tag="CICA Indoor 2025" title={"Format and *rules.*"} id="cica-indoor-2025-title" align="start" reveal />
        <DocumentSource doc={indoorDoc} />
      </header>
      <div className={styles.layout}>
        <DocumentToc label="Indoor rules contents" groups={[
          { label: "CICA Indoor 2025", entries: cicaIndoor2025Sections.map(section => ({ id: section.id, label: section.title })) },
          { label: "CPL Indoor 2025", entries: cplIndoor2025Sections.map(section => ({ id: section.id, label: section.title })) },
        ]} />
        <div className={styles.body}>
          <section aria-labelledby="cica-indoor-2025-title">
            <p className={styles.note}>The fielding-zone, boundary and ceiling diagrams are photos in the source document. Each one is marked below with a link to it.</p>
            {cicaIndoor2025Sections.map(section => <RuleSectionView key={section.id} section={section} sourceUrl={indoorDoc.url} />)}
          </section>

          <section id="cpl-indoor-2025" className={styles.section} aria-labelledby="cpl-indoor-2025-title">
            <header className={styles.docHeader}>
              <SectionIntro tag="CPL Indoor 2025" title={"Tournament *rules.*"} id="cpl-indoor-2025-title" align="start" reveal />
              <DocumentSource doc={cplDoc} />
            </header>
            <p className={styles.note}>ICC and CICA Indoor rules apply unless this document changes them.</p>
            {cplIndoor2025Sections.map(section => <RuleSectionView key={section.id} section={section} sourceUrl={cplDoc.url} />)}
          </section>
        </div>
      </div>
    </div>
  </>
}
