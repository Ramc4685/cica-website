import { existsSync } from "node:fs"
import path from "node:path"
import { CapsuleLink } from "@/components/ui/capsule-link"
import { SectionIntro } from "@/components/ui/section-intro"
import { formatDocumentDate, officialDocumentList, rulesFolderUrl, type OfficialDocument } from "@/lib/documents"
import type { QuickReference } from "@/lib/rules/types"
import styles from "./documents.module.css"

/** True when `pnpm sync:documents` has written the PDF copy into public/ (checked at build time). */
export function hasLocalCopy(doc: OfficialDocument): doc is OfficialDocument & { localPdf: string } {
  return !!doc.localPdf && existsSync(path.join(process.cwd(), "public", doc.localPdf))
}

const kindLabel: Record<OfficialDocument["kind"], string> = { "google-doc": "Google Doc", docx: "Word document", pdf: "PDF" }

/** "Source: <title> · updated <date>" with links to Drive and, when synced, the PDF copy. */
export function DocumentSource({ doc, tone = "light", className }: { doc: OfficialDocument; tone?: "light" | "dark"; className?: string }) {
  return <p className={className ? `${styles.source} ${className}` : styles.source} data-tone={tone}>
    <span>Source: <a href={doc.url} target="_blank" rel="noopener noreferrer">{doc.title}<span className="sr-only"> ({kindLabel[doc.kind]}, opens in a new tab)</span></a></span>
    <span aria-hidden="true">·</span>
    <span>{kindLabel[doc.kind]}, last updated {formatDocumentDate(doc.updated)}</span>
    {doc.revisionNote && <><span aria-hidden="true">·</span><span>{doc.revisionNote}</span></>}
    {hasLocalCopy(doc) && <><span aria-hidden="true">·</span><a href={doc.localPdf} download>PDF copy</a></>}
  </p>
}

export function QuickReferenceCards({ items }: { items: readonly QuickReference[] }) {
  return <ul className={styles.quickGrid}>
    {items.map(card => <li key={card.id}>
      <article className={styles.quickCard} aria-labelledby={`quick-${card.id}`} data-setting={card.setting.toLowerCase()}>
        <p className="tag-row">{card.setting} · {card.season}</p>
        <h3 id={`quick-${card.id}`} className={styles.quickTitle}>{card.competition}</h3>
        <dl className={styles.quickFacts}>
          {card.facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
        </dl>
        <p className={styles.quickSource}>From <a href={card.source.url} target="_blank" rel="noopener noreferrer">{card.source.title}<span className="sr-only"> (opens in a new tab)</span></a>, updated {formatDocumentDate(card.source.updated)}.</p>
        <CapsuleLink href={card.detailsHref} variant="outline" size="block">Read the full rules</CapsuleLink>
      </article>
    </li>)}
  </ul>
}

/** Green roll-up band listing every governing document with its Drive link. */
export function OfficialDocuments({ headingId = "documents-title" }: { headingId?: string }) {
  return <section className={styles.band} data-tone="green" aria-labelledby={headingId}>
    <div className="page-shell">
      <SectionIntro tag="Official documents" title={"Drive is the *source of truth.*"} id={headingId} tone="dark" align="start" reveal
        subtitle="The text on this site is reproduced from these files. If anything here differs from the document in Drive, the document wins." />
      <ul className={styles.docList}>
        {officialDocumentList.map(doc => <li key={doc.id} className={styles.docRow}>
          <div>
            <p className={styles.docMeta}>{doc.appliesTo} · {kindLabel[doc.kind]} · updated {formatDocumentDate(doc.updated)}</p>
            <h3 className={styles.docTitle}>{doc.title}</h3>
            <p className={styles.docSummary}>{doc.summary}</p>
            {doc.external && <p className={styles.docSummary}>Published by the ICC. Linked from CICA’s rules folder, not reproduced on this site.</p>}
          </div>
          <div className={styles.docActions}>
            {doc.pageHref && <CapsuleLink href={doc.pageHref} tone="cream">Read on this site</CapsuleLink>}
            <CapsuleLink href={doc.url} tone="cream" variant="outline" external>Open in Drive</CapsuleLink>
            {hasLocalCopy(doc) && <a className={styles.docPdf} href={doc.localPdf} download>Download PDF copy</a>}
          </div>
        </li>)}
      </ul>
      <p className={styles.bandNote}><a href={rulesFolderUrl} target="_blank" rel="noopener noreferrer">Browse the full rules folder in Google Drive<span className="sr-only"> (opens in a new tab)</span></a></p>
    </div>
  </section>
}
