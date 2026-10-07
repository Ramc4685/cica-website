import { CapsuleLink } from "@/components/ui/capsule-link"
import { PageHero } from "@/components/ui/page-hero"
import { bylawArticles, bylawsPreamble, bylawsTitle } from "@/lib/bylaws"
import { officialDocuments } from "@/lib/documents"
import { pageMetadata } from "@/lib/site-metadata"
import { DocumentSource } from "../rules/_components/official-documents"
import { PrintButton } from "../rules/_components/print-button"
import { DocumentToc, RuleBlocks } from "../rules/_components/rule-text"
import styles from "../rules/_components/documents.module.css"

export const metadata = pageMetadata("Bylaws", "The Central Illinois Cricket Association bylaws: purpose, membership, officers, board of directors, committees, meetings, finances and disciplinary procedures.", "/bylaws/")

const doc = officialDocuments.bylaws

export default function BylawsPage() {
  return <>
    <PageHero tag="Association bylaws" title={"How CICA\nis *governed.*"} intro={bylawsTitle}>
      <DocumentSource doc={doc} className={styles.heroSource} />
      <div className={styles.heroActions}>
        <CapsuleLink href={doc.url} external>Open the Google Doc</CapsuleLink>
        <PrintButton label="Print the bylaws" />
      </div>
    </PageHero>

    <div className={`${styles.sectionTight} page-shell`}>
      <div className={styles.layout}>
        <DocumentToc label="Bylaws contents" groups={[{ entries: [
          { id: "preamble", label: "Preamble" },
          ...bylawArticles.map(article => ({ id: article.id, label: `${article.numeral}. ${article.title}` })),
        ] }]} />
        <article className={styles.body} aria-label={bylawsTitle}>
          <section id="preamble" className={styles.ruleSection} aria-labelledby="preamble-title">
            <h2 id="preamble-title" className={styles.ruleHeading}>Preamble</h2>
            <p className={styles.paragraph}>{bylawsPreamble}</p>
          </section>
          {bylawArticles.map(article => <section key={article.id} id={article.id} className={styles.ruleSection} aria-labelledby={`${article.id}-title`}>
            <h2 id={`${article.id}-title`} className={styles.ruleHeading}><span className={styles.prefix}>Article {article.numeral}</span> {article.title}</h2>
            <RuleBlocks blocks={article.blocks} level="h3" sourceUrl={doc.url} />
          </section>)}
        </article>
      </div>
    </div>
  </>
}
