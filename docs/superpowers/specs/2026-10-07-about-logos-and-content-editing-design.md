# About logo wall and organizer content editing — design

Date: 2026-10-07 · Status: approved in brainstorming, pending spec review

## Intent

**Asked for:** replace the team photo on `/about/` with a composition of every CICA identity in all its colors, with tasteful motion that respects reduced motion; let an admin update champions/winners and add or replace photos; make page edits easy for organizers.

**Decided with the owner:**
- "All colors" = the 7 identities × 3 supplied treatments (transparent, blue background, yellow background) = 21 pieces. Sources: `/Users/ramc/Documents/CICA/cricket association-01…21.png` (blue/yellow are 1500×1500 full-bleed squares).
- Editors are many rotating, non-technical volunteers; access must be easy to grant and revoke.
- Content edits keep the owner's approval gate: Pages CMS commits deploy to staging automatically, then wait on the existing approval-gated production `deploy` job like every other change. (An earlier content fast lane was considered and dropped.)
- Admin approach: Pages CMS (hosted, open source, GitHub App) over a custom PHP admin or Decap + OAuth proxy.
- Delivery as two PRs: (1) logo wall, (2) content editing.

**Success:** About shows all 21 pieces with proportions intact and motion that stops under reduced motion or the site pause toggle; a volunteer invited by email can add a season's champion with a team photo without a developer, see it on staging immediately, and see it live once the owner approves the production deploy; no login code, secrets or client authentication ship in the site; `/admin` stays unavailable.

**Constraints:** Next.js 15 static export on Namecheap shared hosting (Apache + PHP, no Node); repo gates in `deploy/CI.md`; no fabricated winners, stats or endorsements; never merge or approve production without the owner.

## Part 1 — About "family wall" (PR 1)

### Assets
- Export the 14 blue/yellow squares to `public/images/logos-family/cica-logo-<id>-{blue,yellow}.webp` at 360×360 (quality ~82). Mapping from `docs/brand-assets.md`: 01–03 tournaments, 04–06 mains, 07–09 cpl, 10–12 mini, 13–15 indoor, 16–18 100, 19–21 main (source n+1 = blue, n+2 = yellow — verify each visually).
- Transparent logos reuse `public/images/cica-logo-<id>.webp` (589×640; main 640×620).
- Update `docs/brand-assets.md`: blue/yellow treatments are now published on About.

### Component
`components/sections/logo-family-wall.tsx` + `.module.css`, server component (no client JS needed; motion state comes from the existing `html[data-motion]` attribute set by `MotionProvider`).
- Data: an ordered list of the 7 identities (`main, mains, cpl, mini, indoor, tournaments, 100`) with display names, exported from `lib/brand-assets.ts` as `cicaIdentities`.
- Markup: `<figure>` in the existing `.fullBleed` frame position; tiles `aria-hidden`; visually hidden `<figcaption>` naming the seven identities.
- Desktop (≥900px): 7 columns × 3 rows (blue / transparent-on-cream / yellow), alternate columns offset by half a tile, all 21 visible.
- Mobile (<900px): three rows, each a horizontal loop of the 7 identities (duplicated track), alternating direction.
- Proportions: transparent logos `object-fit: contain` inside a square cream tile; squares shown whole. Never stretch or crop artwork.

### Motion (CSS only)
Active only under `@media (prefers-reduced-motion: no-preference)` and `html[data-motion="running"]`:
1. Entrance: one-shot diagonal cascade (opacity + 12px rise), ~900ms total, triggered by the existing reveal system (`motion-entered`).
2. Idle drift: per-column float of a few px with ≤ ±2° tilt, 8–12s periods, staggered.
3. Hover/focus-within lift with soft shadow.
4. Mobile row loop ~45s per cycle.
Otherwise the wall is static and fully visible (covers WCAG 2.2.2 via the site pause control). Animate only `transform`/`opacity`.

### Page change
`app/about/page.tsx`: replace the `bannerPhoto` figure with `<LogoFamilyWall />`; drop the now-unused import. `community-on-field` remains in gallery and home.

### Tests
Jest: renders 21 tiles + caption naming all 7 identities; every tile image path exists under `public/`; tiles are `aria-hidden`. About page no longer references `community-on-field`.

## Part 2 — Organizer content editing with Pages CMS (PR 2)

### Content files and schemas
`content/*.json`, each validated by a zod schema in `lib/content-schema.ts` (strict objects, length caps, `https:`-only URLs, ISO dates). Loaders replace the hard-coded arrays while keeping current exports and types:

| File | Replaces | Editable fields |
|---|---|---|
| `content/champions.json` | `competitions`, `recordsUpdated` (`lib/champions.ts`) | per competition: season, champion, runnerUp?, notes?, photo? {src, alt (required with photo)} |
| `content/photos.json` | `communityPhotos` (`lib/community-photos.ts`) | src, alt (required), caption, objectPosition; derivative sizes computed at build |
| `content/tournaments.json` | `tournaments` (`lib/content.ts`) | description, registrationStatus, deadline, registrationUrl, format |
| `content/season.json` | `seasonEvents`, `announcements`, `faq` (`lib/season.ts`) | as current types |

Layout, headlines, bylaws, board, brand assets and sponsors stay in code. `computeChampionStats` and helpers are unchanged. Champions show a photo only when present; existing text-only records keep working; no records are invented.

### Uploads
- Pages CMS media: `input: public/uploads`, `output: /uploads`, image extensions jpg/jpeg/png/webp, `rename: safe`; folders `champions/`, `photos/`.
- `scripts/process-uploads.mjs` (runs before `build:namecheap` and in CI): checks magic bytes (JPEG/PNG/WebP only; SVG and mismatched extensions rejected), ≤10 MB, then writes resized WebP derivatives (1600px and 640px) into the export. Adds `sharp` as a direct devDependency (already present transitively via Next).
- Failure stops the build; nothing deploys.

### Pages CMS config
`.pages.yml` at repo root defining the four collections as forms and the media settings; commit identity stays the app default so volunteer emails never enter the public history. Not part of the export.

### Publishing
No workflow changes. Pages CMS commits to `main` → existing `check` job (now including content validation and upload checks) → automatic staging deploy → existing `deploy` job, which waits for the owner's approval on the GitHub `Production` environment. No fast lane, no `classify` step, no `deploy-content` job, no `production-content` environment.

### Security
- No login, secrets, client auth or PHP added to the site. Auth lives in Pages CMS/GitHub; only repo admins manage collaborators and `.pages.yml`.
- `tests/admin-security.test.mjs` extended: export contains no `.pages.yml`, no Pages CMS bundle, admin pages still "unavailable". Not deleted.
- Content rendered as React text only; no `dangerouslySetInnerHTML` on content.
- Rollback: `git revert` of the content commit, which flows through staging and approval like any change.

### Docs
- `docs/content-editing.md`: owner setup (install Pages CMS GitHub App on this repo, invite/revoke volunteers, approve production deploys in GitHub Actions) and a one-page volunteer guide. Both state that edits appear on staging.cicainfo.com right away and go live only after the site owner approves the production deploy in GitHub Actions.
- README data flows; privacy page line on organizer-published team photos and how to request removal; `deploy/CI.md` note that content commits follow the normal staging → approval path; `CHANGELOG.md` Unreleased.

### Tests
Jest: schemas accept current data, reject unknown keys / non-https URLs / over-long strings / photo without alt; champions render photo only when present. `node --test`: upload validator (magic bytes, size, SVG, spoofed extension). Admin-security export checks.

## Delivery
Each PR off `origin/main`, built by a multi-agent workflow (opus: plan + security review; sonnet: implementation/UI/docs; haiku: asset export and mechanical gate runs). Full repo gates before each PR; before/after screenshots (desktop + mobile). Owner merges and approves production; owner performs Pages CMS setup after PR 2 merges.

## Out of scope
Roles/tiers inside the CMS (Pages CMS has none; content files stay compatible with Decap if tiers are needed later), editing board/sponsors/bylaws, any server-side admin on Namecheap.
