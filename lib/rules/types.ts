// Structured text for CICA's governing documents, rendered by app/rules/_components/rule-text.tsx.
// Inline markup inside strings: **bold** (as bolded in the source), [label](href) for links, and bare
// email addresses become mailto links.

import type { OfficialDocument } from "@/lib/documents"

export interface RuleListItem {
  text: string
  items?: readonly RuleItem[]
}

export type RuleItem = string | RuleListItem

export type RuleBlock =
  | { kind: "p"; text: string }
  | { kind: "list"; ordered?: boolean; items: readonly RuleItem[] }
  | { kind: "table"; caption: string; head: readonly string[]; rows: readonly (readonly string[])[] }
  /** A diagram that exists only in the source document; rendered as a pointer to it. */
  | { kind: "figure"; description: string }
  /** A labelled sub-part inside a section, e.g. "Section 1: Officers" or "Power plays". */
  | { kind: "group"; label: string; title?: string; blocks: readonly RuleBlock[] }

export interface RuleSection {
  /** Anchor id, unique on its page. */
  id: string
  title: string
  blocks: readonly RuleBlock[]
}

export interface QuickReferenceFact {
  label: string
  value: string
}

export interface QuickReference {
  id: string
  /** Current site competition name (user decision: keep the site's names). */
  competition: string
  setting: "Outdoor" | "Indoor"
  season: string
  /** The document every fact on the card comes from. */
  source: OfficialDocument
  facts: readonly QuickReferenceFact[]
  /** Where the full text lives on this site. */
  detailsHref: string
}
