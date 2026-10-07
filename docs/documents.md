# Governing documents

CICA's rules and bylaws live in a public Google Drive folder:
<https://drive.google.com/drive/folders/16mFxdlNfcbK8_1_z5CNhLpFD5WPh4Asy>. **Drive is the source of
truth.** The site reproduces the text as HTML so people can read, search and link to it, and every
page links back to the Drive file it came from.

| Document | Drive file | Rendered at | Text module | PDF copy |
| --- | --- | --- | --- | --- |
| CICA Bylaws (Google Doc) | `1v6EnSnmrLFJKiB6InjcRulaQI3VA_eFTQvDvKLPTXsg` | `/bylaws/` | `lib/bylaws.ts` | `public/documents/cica-bylaws.pdf` |
| CICA Playing Conditions and Rules, aka General Rules (`CICA_RuleBook.docx`) | `1WSnu-Rk5c890ExCgqbj3Wi4DQ99O9s6P` | `/rules/#general-rules` | `lib/rules/general.ts` | link only |
| CICA Indoor 2025 (`CICA INDOOR 2025.docx`) | `1nlGAKy92qOtTH4nAQgt3STNDYzsqTvht` | `/rules/indoor/#cica-indoor-2025` | `lib/rules/indoor.ts` | link only |
| 2025 CPL Indoor Tournament Rules (Google Doc) | `1blb7YtKfVpT5sExNoPigijqwRVXS5BZpSJAfhdiiV-8` | `/rules/indoor/#cpl-indoor-2025` | `lib/rules/indoor.ts` | `public/documents/cpl-indoor-2025-rules.pdf` |
| ICC Men's T20I Playing Conditions 2025 (PDF) | `1PhbVZo2hPdf-Z4Zw3HhiaxyLyrjISps3` | linked from `/rules/` | none: ICC document, never re-hosted | link only |

`lib/documents.ts` holds the titles, links and "last updated" dates shown on the pages.
`lib/rules/quick-reference.ts` holds the quick-reference cards on `/rules/`; each card names its
source document. The rules-backed FAQ answers in `lib/season.ts` cite their source in a comment.

## Updating after a document changes

The sync is manual on purpose. Someone should read the change before it goes live.

1. **Edit in Drive.** Change the Google Doc or upload the new .docx to the rules folder. Keep
   sharing set to "Anyone with the link can view".
2. **Run `pnpm sync:documents`.** This exports each public Google Doc to PDF in
   `public/documents/`. It uses the export URL
   `https://docs.google.com/document/d/<ID>/export?format=pdf` and checks that the response really is
   a PDF. A doc that isn't shared publicly returns a sign-in page, which fails the check. Uploaded
   .docx files stay link-only, because Drive does not export them without signing in, and the script
   lists them. `pnpm sync:documents --check` shows what it would download without writing anything.
3. **Update the text module.** Copy the changed wording into `lib/bylaws.ts` or `lib/rules/*.ts`.
   Then update `updated` (the Drive modified date) in `lib/documents.ts`. If a quick-reference fact
   or an FAQ answer depends on the change, update it too.
4. **Rebuild and deploy** (`pnpm build:namecheap`). A PDF link only appears on the site once its
   file exists in `public/documents/`, which is checked at build time.

When you add a new Google Doc, add it to `officialDocuments` in `lib/documents.ts` *and* to `DOCS`
in `scripts/sync-documents.mjs`.

## Editorial rules for the reproduced text

- Keep the wording verbatim. Fix only obvious typos, and never change meaning, amounts, points or
  penalties. Each module's header comment lists what was adjusted.
- The bylaws reproduce the governing text as written, tournament names included (BNPL, CICA Cup).
  Site navigation and cards use the site's current competition names.
- The 2022 "Covid-19 Guidelines and Waiver" section of the General Rules is not published. That was
  an organizer decision on 2026-10-07.
- The General Rules .docx has lost the word "Umpire" in about 80 places (for example "towards
  s/Players"). The site restores it from context. The source document should be fixed in Drive.
- The indoor fielding-zone, boundary and ceiling diagrams are photos inside the .docx. The site marks
  where each one goes and links to the source document instead of copying the photos.

## Getting the text out of an uploaded .docx

The Drive text export of `CICA_RuleBook.docx` loses formatting and list structure. To read the file
exactly, download it (`https://drive.google.com/uc?export=download&id=<ID>` works for public files)
and read `word/document.xml` from the zip, or convert it with pandoc if you have it installed.
