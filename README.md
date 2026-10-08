# CICA website

Public website for the Central Illinois Cricket Association at [cicainfo.com](https://cicainfo.com), with a staging copy at [staging.cicainfo.com](https://staging.cicainfo.com). It is a Next.js 15 / React 19 site exported as static files and served from Namecheap cPanel shared hosting. No Node.js runs on the host; the only server code is the PHP form handler.

Taking over the site? Start with [docs/HANDOFF.md](docs/HANDOFF.md).

## Stack

- Next.js 15 (App Router, static export), React 19, TypeScript, Tailwind CSS 3 and CSS modules
- Content in `content/*.json`, validated by `lib/content-schema.ts` and edited through [Pages CMS](https://pagescms.org) (`.pages.yml`)
- Forms post to `public/forms/submit.php` (PHP 8.1+) on the same host
- Jest and Testing Library for components, Cypress for end-to-end forms, `node --test` for deployment and export checks
- GitHub Actions builds, checks and deploys over SSH (`.github/workflows/namecheap.yml`)

## Quick start

Use Node.js 22 and pnpm 11.13.0 (pinned in `packageManager`).

```sh
pnpm install --frozen-lockfile
pnpm dev
```

`pnpm dev` first builds the media derivatives, then starts Next.js at http://localhost:3000.

## Scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` | Build media derivatives, then run the dev server |
| `pnpm media` | Validate `content/uploads` and build WebP derivatives into `public/_media` |
| `pnpm typecheck` | Build media, then `tsc --noEmit` |
| `pnpm lint` | ESLint over `app`, `components` and `lib` with zero warnings allowed |
| `pnpm test` | Build media, then run Jest (CI uses `pnpm test --runInBand`) |
| `pnpm test:forms` | PHP lint and backend tests for the form handler (no mail sent) |
| `pnpm build:namecheap` | Static export to `out/`, as deployed |
| `pnpm test:e2e` | Static export, then Cypress form specs against a local server with a mock form endpoint |
| `pnpm sync:documents` | Refresh PDF copies of the public Google Docs in `public/documents/` |

`pnpm build` and `pnpm start` are the plain Next.js server build, which is not what production uses. The full local check that mirrors CI is listed in [deploy/CI.md](deploy/CI.md#local-checks).

## Layout

| Path | Contents |
| --- | --- |
| `app/` | Routes (one folder per page), global styles, sitemap, robots and manifest |
| `components/` | Page sections, forms, hero rotator, sponsor strips and small UI primitives in `components/ui/` |
| `lib/` | Typed data and loaders, the content schema, rules and bylaws text, form submission client |
| `content/` | Organizer-editable JSON and original uploads (`content/uploads/`, never published as-is) |
| `public/` | Static files: images, document PDFs and `forms/submit.php` |
| `deploy/` | Release packaging, change classifier, SSH installer, `.htaccess` and their tests |
| `scripts/` | Media build, document sync, e2e server and the SSH form-records helper |
| `tests/` | Admin security check against the built export and PHP form backend tests |
| `__tests__/` | Jest component and library tests |
| `cypress/` | End-to-end form and layout specs |
| `docs/` | Operating guides, provenance records and UI screenshots |

## Deploys

Every pull request runs typecheck, lint, PHP form checks, Jest, deployment tests and a static export. Every push to `main` deploys the built artifact to staging, then waits for an approver on the GitHub `production` environment before promoting the same artifact to cicainfo.com. Pushes that change only `content/` since what production serves (Pages CMS edits) go to production automatically. Each deploy records its commit at https://cicainfo.com/deployment.json. See [deploy/CI.md](deploy/CI.md) for setup, secrets, backups and rollback.

## Docs

- [docs/HANDOFF.md](docs/HANDOFF.md): accounts, secrets and steps for transferring ownership
- [deploy/CI.md](deploy/CI.md): CI pipeline, deployment setup, backups and rollback
- [deploy/README.md](deploy/README.md): what each file in `deploy/` does
- [docs/content-editing.md](docs/content-editing.md): volunteer guide to editing content in Pages CMS
- [docs/forms/namecheap.md](docs/forms/namecheap.md): form handler, storage, limits and managing records
- [docs/documents.md](docs/documents.md): bylaws and rules sources in Google Drive and how they are reproduced
- [docs/brand-assets.md](docs/brand-assets.md): logo and sponsor artwork inventory
- [docs/community-imagery.md](docs/community-imagery.md): community photo provenance and sizing
- [docs/ui/README.md](docs/ui/README.md): UI verification notes and before/after screenshots
- [docs/superpowers/](docs/superpowers/README.md): design spec and implementation plans for the logo wall and content editing work
- [CHANGELOG.md](CHANGELOG.md): user-visible changes

## Content rules

Publish only what organizers have confirmed: no sample endorsements, unsourced statistics, invented dates or generic photos presented as CICA events. Event details come from organizers and [CricClubs](https://cricclubs.com/CICA); tournament rules defer to the official documents. Never commit credentials, `.env` files or form records.
