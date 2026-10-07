import { Fragment, type ReactNode } from "react"
import Link from "next/link"
import type { RuleBlock, RuleItem, RuleSection } from "@/lib/rules/types"
import styles from "./documents.module.css"

// Inline markup used in lib/rules/* and lib/bylaws.ts: **bold**, [label](href) (the href may contain one
// level of parentheses, e.g. Wikipedia URLs) and bare email addresses.
const INLINE = /\*\*(.+?)\*\*|\[([^\]]+)\]\(((?:[^()\s]|\([^()\s]*\))+)\)|([A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+)/g

function DocLink({ href, children }: { href: string; children: ReactNode }) {
  if (href.startsWith("/")) return <Link href={href}>{children}</Link>
  if (href.startsWith("mailto:")) return <a href={href}>{children}</a>
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}<span className="sr-only"> (opens in a new tab)</span></a>
}

export function InlineText({ text }: { text: string }) {
  const parts: ReactNode[] = []
  let last = 0
  for (const match of text.matchAll(INLINE)) {
    const index = match.index ?? 0
    if (index > last) parts.push(text.slice(last, index))
    const [, bold, label, href, email] = match
    if (bold !== undefined) parts.push(<strong key={index}><InlineText text={bold} /></strong>)
    else if (label !== undefined && href !== undefined) parts.push(<DocLink key={index} href={href}>{label}</DocLink>)
    else if (email !== undefined) parts.push(<DocLink key={index} href={`mailto:${email}`}>{email}</DocLink>)
    last = index + match[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return <>{parts}</>
}

function RuleList({ items, ordered }: { items: readonly RuleItem[]; ordered?: boolean }) {
  const List = ordered ? "ol" : "ul"
  return <List className={styles.list}>
    {items.map((item, index) => typeof item === "string"
      ? <li key={index}><InlineText text={item} /></li>
      : <li key={index}><InlineText text={item.text} />{item.items && <RuleList items={item.items} />}</li>)}
  </List>
}

type HeadingLevel = "h3" | "h4" | "h5"
const nextLevel = (level: HeadingLevel): HeadingLevel => level === "h3" ? "h4" : "h5"

export interface RuleBlocksProps {
  blocks: readonly RuleBlock[]
  /** Heading level for group labels inside these blocks. */
  level?: HeadingLevel
  /** Source document, for figures that only exist there. */
  sourceUrl: string
}

export function RuleBlocks({ blocks, level = "h4", sourceUrl }: RuleBlocksProps) {
  return <>{blocks.map((block, index) => {
    switch (block.kind) {
      case "p": return <p key={index} className={styles.paragraph}><InlineText text={block.text} /></p>
      case "list": return <RuleList key={index} items={block.items} ordered={block.ordered} />
      case "table": return <div key={index} className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>{block.caption}</caption>
          <thead><tr>{block.head.map(cell => <th key={cell} scope="col">{cell}</th>)}</tr></thead>
          <tbody>{block.rows.map(row => <tr key={row[0]}>{row.map((cell, cellIndex) => cellIndex === 0
            ? <th key={cellIndex} scope="row">{cell}</th>
            : <td key={cellIndex}><InlineText text={cell} /></td>)}</tr>)}</tbody>
        </table>
      </div>
      case "figure": return <p key={index} className={styles.figureNote}>
        <span className={styles.figureLabel}>Diagram</span>
        <span>{block.description}. <DocLink href={sourceUrl}>View it in the source document</DocLink>.</span>
      </p>
      case "group": {
        const Heading = level
        return <div key={index} className={styles.group}>
          <Heading className={styles.groupHeading}>{block.title ? <><span className={styles.groupLabel}>{block.label.endsWith(".") ? block.label : `${block.label}:`}</span> {block.title}</> : block.label}</Heading>
          <RuleBlocks blocks={block.blocks} level={nextLevel(level)} sourceUrl={sourceUrl} />
        </div>
      }
    }
  })}</>
}

/** One anchored section: an h3 title followed by its blocks. */
export function RuleSectionView({ section, sourceUrl, prefix }: { section: RuleSection; sourceUrl: string; prefix?: ReactNode }) {
  return <section id={section.id} className={styles.ruleSection} aria-labelledby={`${section.id}-title`}>
    <h3 id={`${section.id}-title`} className={styles.ruleHeading}>{prefix}{section.title}</h3>
    <RuleBlocks blocks={section.blocks} sourceUrl={sourceUrl} />
  </section>
}

export interface TocEntry { id: string; label: string }
export interface TocGroup { label?: string; entries: readonly TocEntry[] }

/**
 * Sticky table of contents beside the text on desktop, a native <details> disclosure above it on
 * phones. Only one of the two is displayed at a time, so assistive tech never meets both.
 */
export function DocumentToc({ groups, label = "On this page" }: { groups: readonly TocGroup[]; label?: string }) {
  const lists = groups.map((group, index) => <Fragment key={group.label ?? index}>
    {group.label && <p className={styles.tocGroup}>{group.label}</p>}
    <ol className={styles.tocList}>{group.entries.map(entry => <li key={entry.id}><a href={`#${entry.id}`}>{entry.label}</a></li>)}</ol>
  </Fragment>)
  return <>
    <nav className={styles.tocDesktop} aria-label={label}><p className={styles.tocTitle}>{label}</p>{lists}</nav>
    <details className={styles.tocMobile}>
      <summary>{label}</summary>
      <nav aria-label={label}>{lists}</nav>
    </details>
  </>
}
