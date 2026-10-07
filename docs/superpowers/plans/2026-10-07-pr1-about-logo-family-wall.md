# PR 1 — About logo family wall Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the team photo on `/about/` with a 21-piece wall of every CICA identity in its transparent, blue and yellow treatments, with CSS motion that stops under reduced motion and the site pause toggle.

**Architecture:** A server component `LogoFamilyWall` renders a `<section>` (a direct child of `<main>`, so the existing reveal system in `components/site-motion.tsx` adds `motion-entered`) containing a `<figure>` of 21 `aria-hidden` tiles and an `sr-only` caption. All motion is CSS in a module, gated on `@media (prefers-reduced-motion:no-preference)` and `html[data-motion=running]`. Blue/yellow derivatives are exported once from the owner's source folder with `sharp`.

**Tech Stack:** Next.js 15 static export, React server components, CSS modules, Jest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-07-about-logos-and-content-editing-design.md` (Part 1)

## Global Constraints

- Static export only (`pnpm build:namecheap`, `output: export`); no new runtime dependencies.
- Preserve original logo proportions: never stretch or crop artwork (`object-fit: contain` for transparent logos; squares shown whole).
- Animate only `transform` and `opacity`; motion only under `prefers-reduced-motion: no-preference` AND `html[data-motion=running]`.
- Gates before PR: `pnpm lint`, `pnpm typecheck`, `pnpm test --runInBand`, `node --test deploy/tests/*.test.mjs`, `pnpm build:namecheap`, `CICA_TEST_EXPORT_DIR=out node --test tests/admin-security.test.mjs`.
- Conventional Commits, no agent attribution trailers, never force push. `CHANGELOG.md` entry under Unreleased.
- UI PR needs before/after screenshots of `/about/` (desktop 1440 and mobile 390).

## Review Focus

- Reduced motion on: wall must be fully visible and static (nothing left at opacity 0). Test: the CSS module has no `animation:` outside the `no-preference` block (Task 2).
- Site pause toggle (`html[data-motion=paused]`): tiles visible. Test: every animation rule is scoped to `:global(html[data-motion=running])` (Task 2); global rules `app/globals.css:363-364` also pause.
- Typo in an identity id ships a broken image. Test: every tile `src` exists under `public/` (Task 2).
- Screen readers hearing 21 images. Test: wall is `aria-hidden`, one caption names all 7 identities (Task 2).
- 320px phone: no horizontal page scroll from looping rows (frame `overflow:hidden`). Checked by screenshot at 320px (Task 4).

---

### Task 1: Export the 14 colored tiles and record them

**Files:**
- Create: `public/images/logos-family/cica-logo-{main,mains,cpl,mini,indoor,tournaments,100}-{blue,yellow}.webp` (14 files)
- Modify: `docs/brand-assets.md` (CICA identity family section)

- [ ] **Step 1: Visually confirm the mapping.** Sources: `/Users/ramc/Documents/CICA/cricket association-NN.png`. Expected: 01/02/03 tournaments (transparent/blue/yellow), 04–06 mains, 07–09 cpl, 10–12 mini, 13–15 indoor, 16–18 100, 19–21 main. Make 200px previews of each blue/yellow source in the scratchpad and look at them: a "blue" file must have a blue background, "yellow" a yellow one, and the identity must match its transparent sibling. If any differ, use what you see and note it in the report.

- [ ] **Step 2: Export** (repo root; sharp is installed transitively under `node_modules/.pnpm/sharp@0.33.5/node_modules/sharp` if bare `sharp` does not resolve):

```bash
mkdir -p public/images/logos-family
node --input-type=module -e '
import sharp from "sharp"
const src = "/Users/ramc/Documents/CICA"
const ids = ["tournaments","mains","cpl","mini","indoor","100","main"]
for (const [i, id] of ids.entries()) {
  for (const [offset, tone] of [[1,"blue"],[2,"yellow"]]) {
    const n = String(i * 3 + 1 + offset).padStart(2, "0")
    await sharp(`${src}/cricket association-${n}.png`).resize(360, 360).webp({ quality: 82 }).toFile(`public/images/logos-family/cica-logo-${id}-${tone}.webp`)
  }
}'
```

- [ ] **Step 3: Verify:** 14 files; each < 40 KB; `sips -g pixelWidth -g pixelHeight` → 360×360.

- [ ] **Step 4: Update `docs/brand-assets.md`.** In "CICA identity family", replace "The transparent treatment is used on the website so the logo sits naturally on the warm page background. Alternate treatments remain preserved in the source folder and are intentionally not repeated as different identities." with: "The transparent treatment is used across the website. The blue- and yellow-background treatments are published as 360×360 WebP derivatives in `public/images/logos-family/` for the About page family wall, where each identity appears once per treatment; they are the same identities, not additional ones." Add a table column "Blue / yellow derivatives" with `cica-logo-<id>-blue.webp / -yellow.webp`.

- [ ] **Step 5: Commit**

```bash
git add public/images/logos-family docs/brand-assets.md
git commit -m "feat: add blue and yellow CICA identity derivatives"
```

### Task 2: `cicaIdentities` data and the `LogoFamilyWall` component

**Files:**
- Modify: `lib/brand-assets.ts`
- Create: `components/sections/logo-family-wall.tsx`, `components/sections/logo-family-wall.module.css`
- Test: `__tests__/components/sections/LogoFamilyWall.test.tsx`

**Interfaces:**
- Produces: `cicaIdentities: readonly { id: CicaIdentityId; name: string }[]` and `type CicaIdentityId` in `lib/brand-assets.ts`; `LogoFamilyWall()` (no props) in `components/sections/logo-family-wall.tsx`.

- [ ] **Step 1: Write the failing test** `__tests__/components/sections/LogoFamilyWall.test.tsx`:

```tsx
import '@testing-library/jest-dom'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { render, screen } from '@testing-library/react'
declare const expect: jest.Expect
declare const it: jest.It
import { LogoFamilyWall } from '@/components/sections/logo-family-wall'
import { cicaIdentities } from '@/lib/brand-assets'

describe('LogoFamilyWall', () => {
  it('shows all seven identities in three treatments, decorative to assistive tech', () => {
    const { container } = render(<LogoFamilyWall />)
    expect(cicaIdentities).toHaveLength(7)
    expect(container.querySelectorAll('[data-tile]')).toHaveLength(21)
    for (const tone of ['blue', 'clear', 'yellow']) expect(container.querySelectorAll(`[data-tile="${tone}"]`)).toHaveLength(7)
    expect(container.querySelector('[data-wall]')).toHaveAttribute('aria-hidden', 'true')
    const caption = screen.getByText(/CICA family of identities/i)
    for (const identity of cicaIdentities) expect(caption).toHaveTextContent(identity.name)
  })

  it('references only images that exist in public/', () => {
    const { container } = render(<LogoFamilyWall />)
    const sources = new Set([...container.querySelectorAll('img')].map(img => img.getAttribute('src')!))
    expect(sources.size).toBe(21)
    for (const src of sources) expect(existsSync(path.join(process.cwd(), 'public', src))).toBe(true)
  })

  it('scopes every animation to running motion and no-preference', () => {
    const css = readFileSync(path.join(process.cwd(), 'components/sections/logo-family-wall.module.css'), 'utf8')
    const [outside, inside = ''] = css.split('@media (prefers-reduced-motion:no-preference)')
    expect(outside).not.toMatch(/animation\s*:/)
    for (const rule of inside.match(/[^{}]+\{[^{}]*animation\s*:[^}]*\}/g) ?? []) expect(rule.trim()).toMatch(/^:global\(html\[data-motion=running\]\)/)
  })
})
```

- [ ] **Step 2: Run** `pnpm test --runInBand __tests__/components/sections/LogoFamilyWall.test.tsx` → FAIL (module not found).

- [ ] **Step 3: Add data** at the end of `lib/brand-assets.ts`:

```ts
/** The seven CICA identities, ordered for the About family wall. Files: public/images/cica-logo-<id>.webp (transparent) and public/images/logos-family/cica-logo-<id>-{blue,yellow}.webp. */
export const cicaIdentities = [
  { id: "main", name: "CICA" },
  { id: "mains", name: "CICA Mains" },
  { id: "cpl", name: "CPL" },
  { id: "mini", name: "CICA Mini" },
  { id: "indoor", name: "CICA Indoor" },
  { id: "tournaments", name: "CICA Tournaments" },
  { id: "100", name: "CICA 100" },
] as const
export type CicaIdentityId = (typeof cicaIdentities)[number]["id"]
```

- [ ] **Step 4: Component** `components/sections/logo-family-wall.tsx`:

```tsx
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
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, decorative, fixed-size derivatives */}
              <img src={tileSrc(id, tone)} alt="" width={tone === "clear" ? 589 : 360} height={tone === "clear" ? 640 : 360} loading="lazy" decoding="async" />
            </span>)}
          </div>)}
        </div>)}
      </div>
      <figcaption className="sr-only">{caption}</figcaption>
    </figure>
  </section>
}
```

The duplicate track's tiles carry no `data-tile` (21-count holds); `img` count is 42 but 21 unique sources. If ESLint does not know the disable rule name, drop the comment and use whatever the existing code does for raw `<img>`.

- [ ] **Step 5: Styles** `components/sections/logo-family-wall.module.css`. The frame mirrors `.fullBleed` in `app/inner-page.module.css:44-45,61`. Look up the site's real color tokens in `app/globals.css` and substitute them for the fallbacks below (keep the gating untouched):

```css
.frame { margin:0 clamp(8px,1.4vw,24px);overflow:hidden;border-radius:60px;background:var(--cica-green,#0f3d2e);padding:clamp(24px,3.4vw,48px) 0 calc(clamp(24px,3.4vw,48px) + 4vw); }
.figure { margin:0; }
.wall { display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:clamp(10px,1.4vw,20px);padding:0 clamp(20px,3vw,44px); }
.row,.track { display:contents; }
.track[data-copy] { display:none; }
.tile { grid-column:calc(var(--col) + 1);grid-row:calc(var(--row) + 1);aspect-ratio:1;border-radius:22%;overflow:hidden;display:grid;place-items:center;background:var(--cica-cream,#f6f0e3); }
.tile:nth-child(even) { translate:0 50%; }
.tile[data-tone=blue],.tile[data-tone=yellow] { background:none; }
.tile img { width:100%;height:100%;object-fit:contain;display:block; }
.tile[data-tone=clear] img { width:78%;height:78%; }

@media (max-width:899px) {
  .frame { margin-inline:8px;border-radius:35px;padding:24px 0; }
  .wall { display:flex;flex-direction:column;gap:12px;padding:0; }
  .row { display:flex;width:max-content;gap:12px; }
  .track,.track[data-copy] { display:flex;gap:12px; }
  .tile,.tile:nth-child(even) { width:clamp(84px,24vw,120px);translate:none; }
}

@media (prefers-reduced-motion:no-preference) {
  :global(html[data-motion=running]) .frame:global(.motion-entered) .tile { animation:wall-enter .6s cubic-bezier(.22,1,.36,1) both;animation-delay:calc((var(--col) + var(--row)) * 45ms); }
  :global(html[data-motion=running]) .tile img { animation:wall-drift calc(8s + var(--col) * .55s) ease-in-out infinite alternate;animation-delay:calc(var(--col) * -1.3s); }
  :global(html[data-motion=running]) .tile { transition:transform .35s cubic-bezier(.22,1,.36,1),box-shadow .35s; }
  :global(html[data-motion=running]) .tile:hover { transform:translateY(-6px);box-shadow:0 14px 30px rgb(0 0 0 / .25); }
  @media (max-width:899px) {
    :global(html[data-motion=running]) .row { animation:wall-loop 45s linear infinite; }
    :global(html[data-motion=running]) .row:nth-child(even) { animation-direction:reverse; }
  }
}
@keyframes wall-enter { from { opacity:0;transform:translateY(12px); } }
@keyframes wall-drift { from { transform:translateY(-3px) rotate(-1.5deg); } to { transform:translateY(3px) rotate(1.5deg); } }
@keyframes wall-loop { to { transform:translateX(-50%); } }
```

`wall-loop` moves -50% because each row holds two identical tracks. Keyframes stay after the `no-preference` block; they contain no `animation:` declarations so the Step 1 test holds. Tune spacing visually in Task 4, not the gating.

- [ ] **Step 6: Run** the test → PASS; also `pnpm lint && pnpm typecheck`.

- [ ] **Step 7: Commit**

```bash
git add lib/brand-assets.ts components/sections/logo-family-wall.tsx components/sections/logo-family-wall.module.css __tests__/components/sections/LogoFamilyWall.test.tsx
git commit -m "feat: add CICA logo family wall component"
```

### Task 3: Use the wall on About

**Files:**
- Modify: `app/about/page.tsx`
- Test: `__tests__/components/sections/LogoFamilyWall.test.tsx` (add one case)

- [ ] **Step 1: Add failing test case** inside the `describe`:

```tsx
it('replaces the About banner photo', () => {
  const source = readFileSync(path.join(process.cwd(), 'app/about/page.tsx'), 'utf8')
  expect(source).toMatch(/<LogoFamilyWall \/>/)
  expect(source).not.toMatch(/community-on-field|bannerPhoto|communityPhotos/)
})
```

- [ ] **Step 2: Run** → FAIL.

- [ ] **Step 3: Edit `app/about/page.tsx`:** remove `import Image from "next/image"`, the `communityPhotos, photoFocusStyle` import and the `bannerPhoto` constant; add `import { LogoFamilyWall } from "@/components/sections/logo-family-wall"`; replace the `<figure className={s.fullBleed}>…</figure>` block with `<LogoFamilyWall />`. Leave `app/page.tsx` and `lib/community-photos.ts` untouched (`aboutPhotoIds` is used by the home page).

- [ ] **Step 4: Run** the test file, `pnpm lint`, `pnpm typecheck` → PASS.

- [ ] **Step 5: Commit** `git commit -am "feat: show the CICA logo family wall on About"`

### Task 4: Visual verification, changelog, gates, PR

**Files:**
- Modify: `CHANGELOG.md` (Unreleased)

- [ ] **Step 1: Before screenshots** of `https://staging.cicainfo.com/about/` at 1440×900 and 390×844 (scrolled to the banner), saved in the session scratchpad (not the repo).
- [ ] **Step 2: Build and serve:** `pnpm build:namecheap` then `node scripts/e2e.mjs --serve-only` (run it as a tracked background task); screenshot `/about/` at 1440, 390 and 320 widths, once with reduced motion emulated, and once after clicking the site pause toggle. Check: 21 tiles visible on desktop, nothing cropped or stretched, offset columns not clipped, no horizontal page scroll at 320px, wall static and fully visible when reduced or paused. Fix CSS and re-run Task 2 tests if needed.
- [ ] **Step 3: CHANGELOG** — under `## Unreleased` add, matching house style: `- About: replaced the banner photo with an animated wall of all seven CICA identities in their transparent, blue and yellow treatments; motion respects reduced motion and the site pause control.`
- [ ] **Step 4: Gates** — run all six gate commands from Global Constraints; all must pass.
- [ ] **Step 5: Commit** `git commit -am "docs: changelog for About logo family wall"`; push `claude/about-logo-wall`; open a PR against `main` with the before/after screenshots and a body written via `--body-file`.
