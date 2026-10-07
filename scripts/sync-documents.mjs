#!/usr/bin/env node
// Refresh the PDF copies of CICA's public Google Docs in public/documents/.
//
//   pnpm sync:documents            download every Google Doc below
//   pnpm sync:documents --check    report what would be downloaded, write nothing
//
// Google Drive stays the source of truth. Uploaded .docx files cannot be exported by URL without
// signing in, so they stay link-only; the script lists them so nobody wonders where their PDF went.
// Keep DOCS in step with lib/documents.ts (ids and localPdf paths). See docs/documents.md.

import { mkdir, rename, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const outDir = path.join(root, "public", "documents")
const checkOnly = process.argv.includes("--check")

/** Public Google Docs exported to PDF. */
const DOCS = [
  { id: "1v6EnSnmrLFJKiB6InjcRulaQI3VA_eFTQvDvKLPTXsg", title: "CICA Bylaws", file: "cica-bylaws.pdf" },
  { id: "1blb7YtKfVpT5sExNoPigijqwRVXS5BZpSJAfhdiiV-8", title: "2025 CPL Indoor Tournament Rules", file: "cpl-indoor-2025-rules.pdf" },
]

/** Uploaded files that stay link-only (Drive serves them, the site renders their text). */
const LINK_ONLY = [
  { title: "CICA Playing Conditions and Rules (CICA_RuleBook.docx)", url: "https://drive.google.com/file/d/1WSnu-Rk5c890ExCgqbj3Wi4DQ99O9s6P/view" },
  { title: "CICA Indoor 2025 (CICA INDOOR 2025.docx)", url: "https://drive.google.com/file/d/1nlGAKy92qOtTH4nAQgt3STNDYzsqTvht/view" },
  { title: "ICC Men's T20I Playing Conditions 2025 (ICC document, never re-hosted)", url: "https://drive.google.com/file/d/1PhbVZo2hPdf-Z4Zw3HhiaxyLyrjISps3/view" },
]

const exportUrl = id => `https://docs.google.com/document/d/${id}/export?format=pdf`

async function download(doc) {
  const response = await fetch(exportUrl(doc.id), { redirect: "follow" })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const type = response.headers.get("content-type") ?? ""
  const bytes = Buffer.from(await response.arrayBuffer())
  // A private doc answers 200 with a sign-in page, so check the payload is really a PDF.
  if (!type.includes("pdf") || bytes.subarray(0, 5).toString() !== "%PDF-") throw new Error(`not a PDF (content-type ${type || "unknown"}); is the doc shared as "anyone with the link"?`)
  const target = path.join(outDir, doc.file)
  const temp = `${target}.tmp`
  await writeFile(temp, bytes)
  await rename(temp, target)
  return bytes.length
}

async function main() {
  if (!checkOnly) await mkdir(outDir, { recursive: true })
  let failures = 0
  for (const doc of DOCS) {
    const relative = path.relative(root, path.join(outDir, doc.file))
    if (checkOnly) { console.log(`would export  ${doc.title} → ${relative}`); continue }
    try {
      const size = await download(doc)
      console.log(`exported     ${doc.title} → ${relative} (${Math.round(size / 1024)} KB)`)
    } catch (error) {
      failures++
      console.error(`FAILED       ${doc.title}: ${error instanceof Error ? error.message : error}`)
    }
  }
  console.log("\nLink-only (uploaded files; edit in Drive, the site links to them):")
  for (const doc of LINK_ONLY) console.log(`  - ${doc.title}\n    ${doc.url}`)
  console.log("\nIf a document's text changed, update the matching module in lib/ (lib/bylaws.ts or lib/rules/*.ts) and its date in lib/documents.ts, then rebuild.")
  if (failures) process.exitCode = 1
}

await main()
