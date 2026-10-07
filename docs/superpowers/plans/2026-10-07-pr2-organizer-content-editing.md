# PR 2 — Organizer content editing with Pages CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move organizer-owned facts (champions, community photos, tournaments, season announcements/events/FAQ) into validated `content/*.json` files editable through Pages CMS, with uploads validated and optimized at build, and no auth code on the site.

**Architecture:** JSON content files are imported statically by the existing `lib/*` modules and parsed with zod schemas from `lib/content-schema.ts` (these modules are imported by client components too, so no `fs` in `lib/`). A Node script `scripts/build-media.mjs` validates every upload and referenced image (magic bytes, size, location), writes WebP derivatives to a git-ignored `public/_media/`, and writes a git-ignored manifest `lib/generated/media-manifest.json` that `lib/media.ts` reads for dimensions. The script runs before `dev`, `typecheck`, `test` and `build:namecheap`. Pages CMS edits the files declared in `.pages.yml` and commits to `main`; publishing is the unchanged pipeline (staging, then owner approval on Production).

**Tech Stack:** Next.js 15 static export, zod 3, sharp (new direct devDependency; already installed transitively), node:test, Jest, Pages CMS (hosted).

**Spec:** `docs/superpowers/specs/2026-10-07-about-logos-and-content-editing-design.md` (Part 2)

## Global Constraints

- No publishing changes in `.github/workflows/namecheap.yml`: content commits go staging → owner approval like any change. No fast lane, `classify` step, `deploy-content` job or `production-content` environment.
- No login, secrets, client auth, new PHP or `dangerouslySetInnerHTML` for content. `/admin` and `/admin-login` stay "unavailable"; extend `tests/admin-security.test.mjs`, never delete assertions.
- Uploads: jpg/jpeg/png/webp only, checked by magic bytes; SVG rejected; ≤ 10 MB; only under `public/uploads/{champions,photos}/`.
- Content URLs `https:` only; strings length-capped; unknown keys rejected (`.strict()`).
- Never invent winners, records, photos or copy: migrate current data verbatim. No placeholder champion photos anywhere, including screenshots.
- Pages CMS commit identity stays the app default (volunteer emails must not enter public history).
- Gates before PR: `pnpm lint`, `pnpm typecheck`, `pnpm test --runInBand`, `node --test deploy/tests/*.test.mjs`, `pnpm build:namecheap`, `CICA_TEST_EXPORT_DIR=out node --test tests/admin-security.test.mjs`. Conventional Commits; no agent attribution trailers; never force push; `CHANGELOG.md` Unreleased; before/after screenshots of `/champions/` and `/gallery/`.
- Branch `claude/organizer-content-editing` from `origin/main`, independent of PR 1. If PR 1 merged first, resolve a `CHANGELOG.md` conflict by keeping both lines.

## Review Focus

- Pages CMS rewrites a JSON file and silently drops keys not declared in `.pages.yml` (e.g. tournament `logo`, photo `id`). Test (Task 5): every key in each `content/*.json` is declared at the matching path.
- A volunteer deletes or renames a photo whose `id` the code uses (`outdoor-award`, `family-celebration`, `community-on-field`). Expected: build still succeeds with a fallback photo. Test (Task 3).
- A volunteer uploads a 14 MB file, an SVG, a HEIC, or a `.jpg` that is really HTML. Expected: build fails naming the file. Test (Task 2).
- A champion photo without alt text, or a registration URL `javascript:…`. Expected: schema error at build naming the field. Test (Task 1).
- Fresh clone runs `pnpm typecheck`/`pnpm test` before any build. Expected: works because the media script runs first. Check (Task 6 Step 5): gates run after deleting `lib/generated` and `public/_media`.

---

### Task 1: Content schemas and migrated JSON

**Files:**
- Create: `lib/content-schema.ts`, `content/champions.json`, `content/photos.json`, `content/tournaments.json`, `content/season.json`
- Test: `__tests__/lib/content-schema.test.ts`

**Interfaces:**
- Produces (exports of `lib/content-schema.ts`): `championsFileSchema`, `photosFileSchema`, `tournamentsFileSchema`, `seasonFileSchema`, and `parseContent<T>(schema: z.ZodType<T>, data: unknown, file: string): T` which throws `Error("content/<file>: <path>: <message>")`.
- JSON shapes (top-level objects so Pages CMS `type: file` entries hold lists):
  - `champions.json`: `{ "recordsUpdated": "" | "YYYY-MM-DD", "competitions": [{ "id": CompetitionId, "title": string, "records": [{ "season": number, "champion": string, "runnerUp"?: string, "notes"?: string, "photo"?: { "src": "/uploads/champions/<file>", "alt": string } }] }] }`
  - `photos.json`: `{ "photos": [{ "id": slug, "src": "/images/community/<file>.webp" | "/uploads/photos/<file>", "alt": string, "caption": string, "objectPosition": "NN% NN%", "gallery": boolean, "hero": boolean }] }`
  - `tournaments.json`: `{ "tournaments": [Tournament as in lib/content.ts] }`
  - `season.json`: `{ "events": SeasonEvent[], "announcements": Announcement[], "faq": FaqEntry[] }` (types from `lib/season.ts`)

- [ ] **Step 1: Write failing tests** `__tests__/lib/content-schema.test.ts`:

```ts
declare const expect: jest.Expect
declare const it: jest.It
import champions from '@/content/champions.json'
import photos from '@/content/photos.json'
import tournaments from '@/content/tournaments.json'
import season from '@/content/season.json'
import { championsFileSchema, parseContent, photosFileSchema, seasonFileSchema, tournamentsFileSchema } from '@/lib/content-schema'

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value))

describe('content schemas', () => {
  it('accept the migrated content', () => {
    expect(() => parseContent(championsFileSchema, champions, 'champions.json')).not.toThrow()
    expect(() => parseContent(photosFileSchema, photos, 'photos.json')).not.toThrow()
    expect(() => parseContent(tournamentsFileSchema, tournaments, 'tournaments.json')).not.toThrow()
    expect(() => parseContent(seasonFileSchema, season, 'season.json')).not.toThrow()
  })
  it('rejects unknown keys', () => {
    const bad = clone(champions) as any
    bad.competitions[0].records[0].mvp = 'x'
    expect(() => parseContent(championsFileSchema, bad, 'champions.json')).toThrow(/content\/champions\.json: competitions\.0\.records\.0/)
  })
  it('requires alt text with a champion photo and keeps photos under /uploads/champions/', () => {
    const bad = clone(champions) as any
    bad.competitions[0].records[0].photo = { src: '/uploads/champions/team.jpg', alt: '' }
    expect(() => parseContent(championsFileSchema, bad, 'champions.json')).toThrow(/alt/)
    bad.competitions[0].records[0].photo = { src: 'https://evil.example/x.jpg', alt: 'Team' }
    expect(() => parseContent(championsFileSchema, bad, 'champions.json')).toThrow(/src/)
  })
  it('rejects non-https links and over-long text', () => {
    const bad = clone(tournaments) as any
    bad.tournaments[0].registrationUrl = 'javascript:alert(1)'
    expect(() => parseContent(tournamentsFileSchema, bad, 'tournaments.json')).toThrow(/registrationUrl/)
    const long = clone(season) as any
    long.faq[0].answer = 'x'.repeat(5001)
    expect(() => parseContent(seasonFileSchema, long, 'season.json')).toThrow(/answer/)
  })
  it('rejects photos outside the allowed folders and unsafe focal points', () => {
    const bad = clone(photos) as any
    bad.photos[0].src = '/../secret.jpg'
    expect(() => parseContent(photosFileSchema, bad, 'photos.json')).toThrow(/src/)
    const focal = clone(photos) as any
    focal.photos[0].objectPosition = 'center; background:url(x)'
    expect(() => parseContent(photosFileSchema, focal, 'photos.json')).toThrow(/objectPosition/)
  })
})
```

- [ ] **Step 2: Run** `pnpm test --runInBand __tests__/lib/content-schema.test.ts` → FAIL (missing modules). (Until Task 2 wires the media script into `pnpm test`, run `npx jest` directly if needed.)

- [ ] **Step 3: Create the JSON files by migrating verbatim** from `lib/champions.ts` (`recordsUpdated` undefined → `""`; `competitions` exactly), `lib/content.ts` (`tournaments` exactly, `tbcFormat` expanded inline), `lib/season.ts` (`seasonEvents` → `events`, `announcements`, `faq` exactly) and `lib/community-photos.ts`. For photos, order the list to preserve both current orders: `outdoor-award`, `outdoor-bat-presentation`, `indoor-trophy-moment`, then every other `communityPhotos` entry in its current order, then the hero-only extras (`friends-at-the-ground` … `outdoor-community-teams`) in current order. `gallery: true` for entries currently in `communityPhotos`; `hero: true` for entries currently in `heroPhotos`. Drop `width/height/gallerySrc/galleryWidth/galleryHeight` (they come from the media manifest). Keep the FAQ source-citation comments by moving them into `docs/content-editing.md` (Task 6). Diff carefully: no value may change.

- [ ] **Step 4: Write `lib/content-schema.ts`:**

```ts
import { z } from "zod"

const text = (max: number) => z.string().trim().min(1).max(max)
const optionalText = (max: number) => z.string().trim().max(max).optional()
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
const httpsUrl = z.string().url().max(500).refine(value => value.startsWith("https://"), "Links must start with https://")
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words joined by hyphens").max(80)
const uploadExt = /\.(?:jpe?g|png|webp)$/i
const imagePath = (folder: RegExp) => z.string().max(200)
  .regex(folder, "Image must be uploaded through the editor")
  .refine(value => !value.includes(".."), "Invalid image path")
  .refine(value => uploadExt.test(value), "Use a JPG, PNG or WebP image")

export const championPhotoSchema = z.object({
  src: imagePath(/^\/uploads\/champions\/[A-Za-z0-9._-]+$/),
  alt: text(200),
}).strict()

export const championsFileSchema = z.object({
  recordsUpdated: z.union([z.literal(""), isoDate]),
  competitions: z.array(z.object({
    id: z.enum(["mains", "cica-indoor", "cpl-indoor", "cpl-outdoor", "mini", "challengers"]),
    title: text(80),
    records: z.array(z.object({
      season: z.number().int().min(1998).max(2100),
      champion: text(80),
      runnerUp: optionalText(80),
      notes: optionalText(300),
      photo: championPhotoSchema.optional(),
    }).strict()),
  }).strict()),
}).strict()

export const photosFileSchema = z.object({
  photos: z.array(z.object({
    id: slug,
    src: imagePath(/^\/(?:images\/community|uploads\/photos)\/[A-Za-z0-9._-]+$/),
    alt: text(200),
    caption: text(160),
    objectPosition: z.string().regex(/^\d{1,3}% \d{1,3}%$/, "Use a focal point like 50% 35%"),
    gallery: z.boolean(),
    hero: z.boolean(),
  }).strict()).min(1),
}).strict()

const tbc = z.literal("tbc")
export const tournamentsFileSchema = z.object({
  tournaments: z.array(z.object({
    id: slug,
    name: text(80),
    setting: z.enum(["Outdoor", "Indoor"]),
    logo: z.string().regex(/^\/images\/cica-logo-[a-z0-9-]+\.webp$/),
    description: text(400),
    registrationStatus: z.enum(["open", "closed", "upcoming", "tbc"]),
    registrationDeadline: isoDate.optional(),
    registrationUrl: httpsUrl.optional(),
    format: z.object({
      overs: z.union([z.number().int().min(1).max(100), tbc]).optional(),
      ballType: z.enum(["leather", "tennis", "tbc"]).optional(),
      squadSize: z.union([z.number().int().min(1).max(40), tbc]).optional(),
      rulesPdf: httpsUrl.optional(),
    }).strict(),
  }).strict()),
}).strict()

export const seasonFileSchema = z.object({
  events: z.array(z.object({ id: slug, title: text(120), date: isoDate, competitionId: slug.optional(), venueId: slug.optional(), summary: optionalText(400), url: httpsUrl.optional() }).strict()),
  announcements: z.array(z.object({ id: slug, title: text(120), date: isoDate, body: text(2000), url: httpsUrl.optional() }).strict()),
  faq: z.array(z.object({ id: slug, question: text(200), answer: text(5000) }).strict()),
}).strict()

export function parseContent<T>(schema: z.ZodType<T>, data: unknown, file: string): T {
  const result = schema.safeParse(data)
  if (result.success) return result.data
  const issue = result.error.issues[0]
  throw new Error(`content/${file}: ${issue.path.join(".")}: ${issue.message}`)
}
```

Raise a cap only if migrated data exceeds it (never truncate data). Pages CMS may write empty strings for blank optional fields; if so, preprocess `""` → `undefined` for optional fields (`z.preprocess(v => v === "" ? undefined : v, …)`) and add a test for it.

- [ ] **Step 5: Run** the test → PASS. **Commit:** `git add content lib/content-schema.ts __tests__/lib/content-schema.test.ts && git commit -m "feat: add validated content files for organizer-editable data"`

### Task 2: Media validation, derivatives and manifest

**Files:**
- Create: `scripts/build-media.mjs`, `scripts/media-checks.mjs`, `lib/media.ts`, `public/uploads/champions/.gitkeep`, `public/uploads/photos/.gitkeep`
- Modify: `package.json` (scripts, `sharp` devDependency), `.gitignore`
- Test: `deploy/tests/media.test.mjs`

**Interfaces:**
- `scripts/media-checks.mjs` exports `sniffImageType(head: Buffer): "jpeg" | "png" | "webp" | null`, `checkUpload({ name, size, head }): string | null` (null = ok), `MAX_UPLOAD_BYTES = 10 * 1024 * 1024`, `collectImageSources({ champions, photos }): string[]`.
- Manifest `lib/generated/media-manifest.json`: `{ "<src>": { "width": number, "height": number, "full": { "src": "/_media/<name>-1600.webp", "width": number, "height": number }, "gallery": { "src": "/_media/<name>-640.webp", "width": number, "height": number } } }`.
- `lib/media.ts` exports `MediaVariant`, `MediaEntry`, `mediaFor(src: string): MediaEntry` (throws `Error("Missing media for <src>; run pnpm media")`).

- [ ] **Step 1: Write failing node tests** `deploy/tests/media.test.mjs`:

```js
import assert from "node:assert/strict"
import test from "node:test"
import { MAX_UPLOAD_BYTES, checkUpload, collectImageSources, sniffImageType } from "../../scripts/media-checks.mjs"

const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0])
const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0])
const webp = Buffer.from("RIFF\0\0\0\0WEBP", "latin1")
const svg = Buffer.from("<svg xmlns='http://www.w3.org/2000/svg'><script>", "utf8")
const html = Buffer.from("<!doctype html><script>", "utf8")

test("sniffs real image bytes", () => {
  assert.equal(sniffImageType(jpeg), "jpeg")
  assert.equal(sniffImageType(png), "png")
  assert.equal(sniffImageType(webp), "webp")
  assert.equal(sniffImageType(svg), null)
})
test("accepts matching uploads within the size cap", () => {
  assert.equal(checkUpload({ name: "team.jpg", size: 1000, head: jpeg }), null)
  assert.equal(checkUpload({ name: "team.JPEG", size: 1000, head: jpeg }), null)
  assert.equal(checkUpload({ name: "team.webp", size: MAX_UPLOAD_BYTES, head: webp }), null)
})
test("rejects SVG, spoofed extensions, unknown types and oversize files", () => {
  assert.match(checkUpload({ name: "logo.svg", size: 10, head: svg }), /JPG, PNG or WebP/)
  assert.match(checkUpload({ name: "team.jpg", size: 10, head: html }), /not a real/)
  assert.match(checkUpload({ name: "team.png", size: 10, head: jpeg }), /do not match/)
  assert.match(checkUpload({ name: "team.heic", size: 10, head: jpeg }), /JPG, PNG or WebP/)
  assert.match(checkUpload({ name: "team.jpg", size: MAX_UPLOAD_BYTES + 1, head: jpeg }), /10 MB/)
})
test("collects every image referenced by content", () => {
  const sources = collectImageSources({
    champions: { competitions: [{ records: [{ photo: { src: "/uploads/champions/a.jpg" } }, {}] }] },
    photos: { photos: [{ src: "/images/community/b.webp" }] },
  })
  assert.deepEqual(sources.sort(), ["/images/community/b.webp", "/uploads/champions/a.jpg"])
})
```

- [ ] **Step 2: Run** `node --test deploy/tests/media.test.mjs` → FAIL.

- [ ] **Step 3: Write `scripts/media-checks.mjs`:**

```js
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
const extensionTypes = { jpg: "jpeg", jpeg: "jpeg", png: "png", webp: "webp" }
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

export function sniffImageType(head) {
  if (head.length >= 3 && head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return "jpeg"
  if (head.length >= 8 && head.subarray(0, 8).equals(PNG_SIGNATURE)) return "png"
  if (head.length >= 12 && head.toString("latin1", 0, 4) === "RIFF" && head.toString("latin1", 8, 12) === "WEBP") return "webp"
  return null
}

/** Returns null when the upload is acceptable, or a message an organizer can act on. */
export function checkUpload({ name, size, head }) {
  const extension = name.includes(".") ? name.split(".").pop().toLowerCase() : ""
  const expected = extensionTypes[extension]
  if (!expected) return `${name}: use a JPG, PNG or WebP image`
  const actual = sniffImageType(head)
  if (!actual) return `${name}: not a real JPG, PNG or WebP image`
  if (actual !== expected) return `${name}: file contents (${actual}) do not match the .${extension} extension`
  if (size > MAX_UPLOAD_BYTES) return `${name}: larger than 10 MB; export a smaller copy and upload again`
  return null
}

export function collectImageSources({ champions, photos }) {
  const sources = new Set()
  for (const competition of champions.competitions ?? []) for (const record of competition.records ?? []) if (record.photo?.src) sources.add(record.photo.src)
  for (const photo of photos.photos ?? []) if (photo.src) sources.add(photo.src)
  return [...sources]
}
```

- [ ] **Step 4: Run** the node test → PASS.

- [ ] **Step 5: Write `scripts/build-media.mjs`** (ESM, run from repo root):

```js
import { mkdir, open, readdir, readFile, stat, writeFile } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"
import { checkUpload, collectImageSources } from "./media-checks.mjs"

const root = process.cwd()
const publicDir = path.join(root, "public")
const outDir = path.join(publicDir, "_media")
const manifestFile = path.join(root, "lib/generated/media-manifest.json")
const readJson = async file => JSON.parse(await readFile(path.join(root, file), "utf8"))
const errors = []

// Every file in public/uploads must be a valid image, including uploads not yet referenced by content.
for (const folder of ["champions", "photos"]) {
  const dir = path.join(publicDir, "uploads", folder)
  for (const entry of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
    if (entry.name === ".gitkeep") continue
    if (!entry.isFile()) { errors.push(`uploads/${folder}/${entry.name}: only image files are allowed here`); continue }
    const file = path.join(dir, entry.name)
    const handle = await open(file)
    const head = Buffer.alloc(16)
    await handle.read(head, 0, 16, 0)
    await handle.close()
    const problem = checkUpload({ name: entry.name, size: (await stat(file)).size, head })
    if (problem) errors.push(`uploads/${folder}/${problem}`)
  }
}

// Every image referenced by content must exist; build derivatives and the manifest.
const sources = collectImageSources({ champions: await readJson("content/champions.json"), photos: await readJson("content/photos.json") })
await mkdir(outDir, { recursive: true })
await mkdir(path.dirname(manifestFile), { recursive: true })
const manifest = {}
for (const src of sources) {
  const file = path.join(publicDir, src)
  if (!file.startsWith(publicDir + path.sep)) { errors.push(`${src}: invalid path`); continue }
  const info = await stat(file).catch(() => null)
  if (!info) { errors.push(`${src}: referenced in content but the file is missing`); continue }
  const base = src.replace(/^\//, "").replace(/[/.]/g, "-")
  const variant = async max => {
    const name = `${base}-${max}.webp`
    const target = path.join(outDir, name)
    const existing = await stat(target).catch(() => null)
    const image = existing && existing.mtimeMs >= info.mtimeMs ? sharp(target) : null
    if (image) { const meta = await image.metadata(); return { src: `/_media/${name}`, width: meta.width, height: meta.height } }
    const { width, height } = await sharp(file).rotate().resize({ width: max, height: max, fit: "inside", withoutEnlargement: true }).webp({ quality: 80 }).toFile(target)
    return { src: `/_media/${name}`, width, height }
  }
  const full = await variant(1600)
  manifest[src] = { width: full.width, height: full.height, full, gallery: await variant(640) }
}

if (errors.length) {
  console.error(`Media check failed:\n- ${errors.join("\n- ")}`)
  process.exit(1)
}
await writeFile(manifestFile, JSON.stringify(manifest, null, 2) + "\n")
console.log(`Media ready: ${sources.length} images.`)
```

- [ ] **Step 6: Wire scripts.** `package.json`: add `"media": "node scripts/build-media.mjs"`; set `"dev": "node scripts/build-media.mjs && next dev"`, `"typecheck": "node scripts/build-media.mjs && tsc --noEmit"`, `"test": "node scripts/build-media.mjs && jest"` (`pnpm test --runInBand` appends the flag to `jest`), `"build:namecheap": "node scripts/build-media.mjs && CICA_STATIC_EXPORT=1 next build"`. Add `sharp` to `devDependencies` at the version already in the lockfile (`pnpm add -D sharp@0.33.5`); confirm `pnpm install --frozen-lockfile` passes. Append `/public/_media/` and `/lib/generated/` to `.gitignore`. Add the two `.gitkeep` files. Check `deploy/prepare-release.mjs` and `deploy/namecheap.htaccess` accept a `/_media/` folder and `/uploads/` folder in the export (adjust allowlists there if they restrict paths, with a test in `deploy/tests/deployment.test.mjs`).

- [ ] **Step 7: Write `lib/media.ts`:**

```ts
import manifest from "@/lib/generated/media-manifest.json"

export interface MediaVariant { src: string; width: number; height: number }
export interface MediaEntry { width: number; height: number; full: MediaVariant; gallery: MediaVariant }

const entries = manifest as Record<string, MediaEntry>

/** Dimensions and optimized derivatives for a content image, produced by scripts/build-media.mjs. */
export function mediaFor(src: string): MediaEntry {
  const entry = entries[src]
  if (!entry) throw new Error(`Missing media for ${src}; run pnpm media`)
  return entry
}
```

- [ ] **Step 8: Run** `pnpm media` → "Media ready: N images." (N = number of photos); `pnpm typecheck`; `node --test deploy/tests/*.test.mjs` → PASS. **Commit:** `git add scripts lib/media.ts deploy package.json pnpm-lock.yaml .gitignore public/uploads && git commit -m "feat: validate and optimize content images at build"`

### Task 3: Point the data modules at the content files

**Files:**
- Modify: `lib/champions.ts`, `lib/community-photos.ts`, `lib/content.ts`, `lib/season.ts`, `app/page.tsx` (photo lookups only)
- Test: `__tests__/lib/content-loaders.test.ts`; existing suites must stay green unchanged.

**Interfaces:**
- Consumes: `parseContent` + schemas (Task 1); `mediaFor` (Task 2).
- Produces (public exports unchanged): `competitions`, `recordsUpdated` (`string | undefined`; `""` → `undefined`), `ChampionRecord` gains `photo?: { src: string; alt: string }`; `communityPhotos` (gallery entries, same `CommunityPhoto` shape — `src/width/height` from `mediaFor(src).full`, `gallerySrc/galleryWidth/galleryHeight` from `.gallery`), `heroPhoto`, `heroPhotos`, `aboutPhotoIds`, `communityFeaturePhotoId`, `photoFocusStyle`; `tournaments`; `seasonEvents`, `announcements`, `faq`. New: `photoById(id: string): CommunityPhoto` returning the matching gallery photo or `communityPhotos[0]`.

- [ ] **Step 1: Write failing test** `__tests__/lib/content-loaders.test.ts`:

```ts
declare const expect: jest.Expect
declare const it: jest.It
import { competitions } from '@/lib/champions'
import { communityPhotos, heroPhoto, heroPhotos, photoById } from '@/lib/community-photos'

describe('content loaders', () => {
  it('keep champion records', () => {
    expect(competitions.find(c => c.id === 'mains')?.records[0]).toMatchObject({ season: 2024, champion: 'BloomBoys' })
  })
  it('build photos with derivative dimensions and preserve order', () => {
    expect(heroPhoto.id).toBe('outdoor-award')
    expect(communityPhotos[0].id).toBe('outdoor-award')
    expect(heroPhotos.map(p => p.id).slice(0, 3)).toEqual(['outdoor-award', 'outdoor-bat-presentation', 'indoor-trophy-moment'])
    for (const photo of communityPhotos) {
      expect(photo.gallerySrc).toMatch(/^\/_media\//)
      expect(photo.width).toBeGreaterThan(0)
    }
  })
  it('falls back when a referenced photo id was removed by an editor', () => {
    expect(photoById('does-not-exist').id).toBe(communityPhotos[0].id)
  })
})
```

- [ ] **Step 2: Run** → FAIL (`photoById` missing).

- [ ] **Step 3: Implement.** Replace each hard-coded array with an import + `parseContent`, keeping types and helpers in place. `lib/champions.ts` (keep `computeChampionStats` / `titlesForTeam` untouched):

```ts
import championsFile from "@/content/champions.json"
import { championsFileSchema, parseContent } from "@/lib/content-schema"
// … existing CompetitionId / ChampionRecord (add `photo?: { src: string; alt: string }`) / Competition types …
const championsContent = parseContent(championsFileSchema, championsFile, "champions.json")
/** ISO date organizers last checked the archive; edited in content/champions.json. */
export const recordsUpdated: string | undefined = championsContent.recordsUpdated || undefined
/** Records are newest first. Edited through Pages CMS in content/champions.json. */
export const competitions: readonly Competition[] = championsContent.competitions
```

`lib/community-photos.ts`: keep the `CommunityPhoto` interface and `photoFocusStyle`; build every photo from `photos.json` + `mediaFor`; `communityPhotos = all.filter(p => p.gallery)`; `heroPhotos = all.filter(p => p.hero)` mapped to the existing `Pick<…>` shape with `.full`; `photoById` as specified; `heroPhoto = photoById("outdoor-award")`. In `app/page.tsx` replace `communityPhotos.find(photo => photo.id === id)!` with `photoById(id)`. `lib/content.ts`: keep `communityLinks` and types, load `tournaments`. `lib/season.ts`: keep venues, sponsorTiers, voices and metrics in code; load events/announcements/faq; drop the `TODO(organizers)` comments for data that is now organizer-editable, replacing them with a pointer to `docs/content-editing.md`.

- [ ] **Step 4: Run** `pnpm test --runInBand` and `pnpm typecheck` → PASS. Any text drift means data changed — fix the JSON, not the test.

- [ ] **Step 5: Commit** `git commit -am "refactor: load organizer content from validated JSON files"`

### Task 4: Champion photos on the archive

**Files:**
- Modify: `components/sections/champions-showcase.tsx`, `components/sections/champions-showcase.module.css`
- Test: `__tests__/components/sections/ChampionsShowcase.test.tsx` (add cases)

**Interfaces:** If `ChampionsShowcase` has no data override prop, add `competitions?: readonly Competition[]` defaulting to the module data (used by tests). Photos render only in the `full` variant.

- [ ] **Step 1: Failing tests** (add `import { competitions } from '@/lib/champions'` if absent):

```tsx
jest.mock('@/lib/media', () => ({ mediaFor: () => ({ width: 1200, height: 800, full: { src: '/_media/x-1600.webp', width: 1200, height: 800 }, gallery: { src: '/_media/x-640.webp', width: 640, height: 427 } }) }))

it('shows a champion photo with its alt text only when a record has one', () => {
  const withPhoto = competitions.map(c => c.id === 'mains'
    ? { ...c, records: [{ ...c.records[0], photo: { src: '/uploads/champions/team.jpg', alt: 'Test alt text' } }, ...c.records.slice(1)] } : c)
  render(<ChampionsShowcase competitions={withPhoto} />)
  expect(screen.getByRole('img', { name: 'Test alt text' })).toBeInTheDocument()
  expect(screen.getByText(/2024 champions: BloomBoys/)).toBeInTheDocument()
})
it('renders no champion photos when no record has one', () => {
  const { container } = render(<ChampionsShowcase />)
  expect(container.querySelectorAll('[data-champion-photo]')).toHaveLength(0)
})
```

(If the module mock conflicts with `lib/community-photos` imports in this file, mock only `mediaFor` for `/uploads/` sources via `jest.requireActual`.)

- [ ] **Step 2: Run** → FAIL.

- [ ] **Step 3: Implement** a `ChampionPhotos` subcomponent rendered above `ChampionTable` in the full variant: a list of `<figure data-champion-photo>` for records with `photo`, each `<img src={gallery.src} srcSet={`${gallery.src} ${gallery.width}w, ${full.src} ${full.width}w`} sizes="(max-width: 700px) 100vw, 33vw" width={gallery.width} height={gallery.height} alt={photo.alt} loading="lazy" decoding="async">` plus `<figcaption>{season} champions: {champion}</figcaption>`. Text only via JSX. CSS: `grid-template-columns:repeat(auto-fill,minmax(220px,1fr))`, rounded corners matching the site, `object-fit:cover` (team photos, not logos).

- [ ] **Step 4: Run** tests → PASS. **Commit** `git commit -am "feat: show organizer-supplied champion photos in the archive"`

### Task 5: Pages CMS configuration

**Files:**
- Create: `.pages.yml`
- Test: `__tests__/lib/pages-config.test.ts`

- [ ] **Step 1: Read the current Pages CMS docs** (https://pagescms.org/docs/configuration/ and its fields, media and settings pages) for the exact syntax of `type: file` entries with `format: json`, list fields, object fields, `select` options, hidden/read-only fields, image fields bound to a named media entry, and multiple named `media` entries. Do not guess; match the docs.

- [ ] **Step 2: Failing test** `__tests__/lib/pages-config.test.ts` — parse `.pages.yml` with the `yaml` package if present in `node_modules` (check the lockfile; otherwise add it as a devDependency after a quick health check) and assert:
  1. `content` has `type: file`, `format: json` entries for the four `content/*.json` files.
  2. Field coverage: every key appearing in any item of each JSON (recursively, including list items and nested objects, plus every optional key in the zod schema such as `photo`, `runnerUp`, `notes`, `registrationDeadline`, `registrationUrl`, `rulesPdf`) is declared at the matching path.
  3. Media entries map `public/uploads/champions` → `/uploads/champions` and `public/uploads/photos` → `/uploads/photos`, extensions exactly `[jpg, jpeg, png, webp]`.
  4. No `settings.commit.identity: user`.

- [ ] **Step 3: Write `.pages.yml`.** Labels and descriptions for non-technical volunteers (e.g. "Champion — team name exactly as it should appear", "Photo description for people using screen readers (required)"). Code-owned keys (competition `id`, tournament `id`, `logo`, `setting`) declared but hidden/read-only per the docs. `registrationStatus`, `ballType` as `select`; dates as `date` with `YYYY-MM-DD`; `required: true` on alt text, champion, season, titles. Champion `photo.src` → image field on the champions media entry; photo `src` → image field on the photos media entry.

- [ ] **Step 4: Run** test → PASS. **Commit** `git add .pages.yml __tests__/lib/pages-config.test.ts package.json pnpm-lock.yaml && git commit -m "feat: configure Pages CMS forms for organizer content"`

### Task 6: Security assertions, docs, privacy

**Files:**
- Modify: `tests/admin-security.test.mjs`, `README.md`, `app/privacy/page.tsx`, `deploy/CI.md`, `CHANGELOG.md`
- Create: `docs/content-editing.md`

- [ ] **Step 1: Extend `tests/admin-security.test.mjs`** (keep every existing assertion). Inside the `if (process.env.CICA_TEST_EXPORT_DIR)` block add:

```js
  test("export ships no CMS configuration or editor bundle", async () => {
    const exportRoot = path.resolve(root, process.env.CICA_TEST_EXPORT_DIR)
    await assert.rejects(access(path.join(exportRoot, ".pages.yml")), { code: "ENOENT" })
    const pending = [exportRoot]
    while (pending.length) {
      const directory = pending.pop()
      for (const entry of await readdir(directory, { withFileTypes: true })) {
        const file = path.join(directory, entry.name)
        if (entry.isDirectory()) pending.push(file)
        else if (/\.(?:html|js)$/.test(entry.name)) assert.doesNotMatch(await readFile(file, "utf8"), /pagescms|decap-cms|netlify-cms/i, `CMS code in ${path.relative(exportRoot, file)}`)
      }
    }
  })
```

Outside it, a source test: every `content/*.json` file contains no `<script`, `javascript:` or `\bon[a-z]+=` text.

- [ ] **Step 2: `docs/content-editing.md`**, two parts.
  **Site owner:** install the Pages CMS GitHub App (https://app.pagescms.org) on `Ramc4685/cica-website` only; open the repo in Pages CMS; invite volunteers by email under collaborators; remove them at season end; edits commit to `main`, deploy to staging.cicainfo.com automatically, and **go live only after you approve the production deploy** in GitHub → Actions → "CI and Namecheap deployment" → the run → Review deployments → Production; undo = revert the commit in GitHub (it flows through staging and approval the same way); if a build fails, the Actions log names the content field or upload to fix. Include the FAQ source-citation notes moved from `lib/season.ts`.
  **Volunteers (one page):** sign in from the email invite; the four forms; adding a champion and team photo (JPG/PNG/WebP under 10 MB, required description, only with the team's consent); edits show on staging.cicainfo.com within minutes and go live after the site owner approves; never enter results you have not confirmed; contact organizers@cicainfo.com.
- [ ] **Step 3: Privacy page** (`app/privacy/page.tsx`): a short section in the page's style — organizers publish team and community photos with the team's consent; email organizers@cicainfo.com to have a photo removed; invited organizers edit through Pages CMS, which holds their sign-in email (this site does not).
- [ ] **Step 4: README** data flows (content in `content/*.json`, edited via Pages CMS, uploads in `public/uploads`, derivatives from `pnpm media`). **`deploy/CI.md`**: content commits follow the normal staging → Production approval path; `check` fails on invalid content or uploads. **CHANGELOG** under Unreleased: `- Organizers can update champions (with optional team photos), community photos, tournament details, announcements, events and FAQ through Pages CMS; uploads are validated and optimized at build, and edits go live after the owner approves the production deploy.`
- [ ] **Step 5: Run** all six gates from a clean state (`rm -rf lib/generated public/_media out .next` first). **Commit** `git commit -am "docs: organizer content editing guide, privacy and security checks"`

### Task 7: Visual verification and PR

- [ ] **Step 1:** Before screenshots of `https://staging.cicainfo.com/champions/` and `/gallery/` (1440 and 390). After: `pnpm build:namecheap`, serve with `node scripts/e2e.mjs --serve-only` as a tracked background task, screenshot the same pages. They must look the same (no champion photos exist yet); the photo layout is covered by the Task 4 tests. Do not add placeholder champion photos.
- [ ] **Step 2:** Push `claude/organizer-content-editing`, open a PR against `main` (body via `--body-file`): what changed, owner setup steps (link `docs/content-editing.md`), security model (no auth on site, validation, unchanged approval gate), screenshots.
