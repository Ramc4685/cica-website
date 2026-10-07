import { CricketFaq } from "@/components/sections/cricket-faq"
import { CapsuleLink } from "@/components/ui/capsule-link"
import { PageHero } from "@/components/ui/page-hero"
import { SectionIntro } from "@/components/ui/section-intro"
import { officialDocuments } from "@/lib/documents"
import { generalRulesSections } from "@/lib/rules/general"
import { quickReferences } from "@/lib/rules/quick-reference"
import { faq } from "@/lib/season"
import { pageMetadata } from "@/lib/site-metadata"
import { DocumentSource, OfficialDocuments, QuickReferenceCards } from "./_components/official-documents"
import { DocumentToc, RuleSectionView } from "./_components/rule-text"
import styles from "./_components/documents.module.css"

export const metadata = pageMetadata("Rules & documents", "CICA’s General Rules, playing conditions, quick-reference formats for CPL Indoor and CICA Indoor 2025, and links to every official document.", "/rules/")

const rulesFaqIds = new Set(["rules", "format", "replace-player", "playoff-eligibility", "complaints", "fees"])
const general = officialDocuments.generalRules

export default function RulesPage() {
  return <>
    <PageHero tag="Rules & documents" title={"Know the game.\nRespect the *community.*"}
      intro="The rules CICA plays by, reproduced from the association’s official documents, with a quick reference for each competition and a link back to every source.">
      <div className={styles.heroActions}>
        <CapsuleLink href="#general-rules">Read the General Rules</CapsuleLink>
        <CapsuleLink href="/rules/indoor/" variant="outline">Indoor rules</CapsuleLink>
        <CapsuleLink href="/bylaws/" variant="outline">Bylaws</CapsuleLink>
      </div>
    </PageHero>

    <section className={`${styles.sectionTight} page-shell`} aria-labelledby="quick-title">
      <SectionIntro tag="Quick reference" title={"Formats at a *glance.*"} id="quick-title" reveal
        subtitle="Each card is built only from the document named on it. Overs and roster limits for a new season are set by CICA before that tournament starts." />
      <QuickReferenceCards items={quickReferences} />
    </section>

    <OfficialDocuments />

    <section id="general-rules" className={`${styles.section} page-shell`} aria-labelledby="general-rules-title">
      <header className={styles.layoutHeader}>
        <SectionIntro tag="CICA General Rules" title={"Playing conditions\nand *rules.*"} id="general-rules-title" align="start" reveal />
        <DocumentSource doc={general} />
      </header>
      <div className={styles.layout}>
        <DocumentToc groups={[{ entries: generalRulesSections.map(section => ({ id: section.id, label: section.title })) }]} label="General Rules contents" />
        <div className={styles.body}>
          <p className={styles.note}>The 2022 Covid-19 guidelines in the source document applied to that season only and are not reproduced here. Where the source has lost the word “Umpire”, it is restored.</p>
          {generalRulesSections.map(section => <RuleSectionView key={section.id} section={section} sourceUrl={general.url} />)}
        </div>
      </div>
    </section>

    <CricketFaq items={faq.filter(item => rulesFaqIds.has(item.id))} tag="Rules in brief" title={"Common rules *questions.*"} headingId="rules-faq-title" className={styles.noPrint} />
  </>
}
