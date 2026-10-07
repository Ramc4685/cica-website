# CICA website

Public website for the Central Illinois Cricket Association, hosted at [cicainfo.com](https://cicainfo.com) on Namecheap cPanel.

## Develop and validate

Use Node.js 22 and pnpm 11.13.0. This checkout is the single working copy at `/Users/ramc/Documents/Code/Git/cica-website`.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm typecheck
pnpm lint
pnpm test --runInBand
pnpm build:namecheap
CICA_TEST_EXPORT_DIR=out node --test tests/admin-security.test.mjs
```

The static build exports to `out/`. [CI setup and rollback](deploy/CI.md) describes the checked GitHub Actions pipeline, production secrets and backups. PRs are checked; successful builds from main deploy automatically using a dedicated SSH key and verified server host identity. Deployment credentials never belong in source or client bundles.

## Forms and administration

The contact, updates and sponsorship forms submit to a same-origin PHP backend on Namecheap. Requests are validated and saved privately outside the public website folder, with notifications to the organizers. Read [hosted form operation](docs/forms/namecheap.md) for storage, limits, testing and delivery verification. An updates request is separate from playing or tournament registration; the Get Involved page explains participation pathways. Historical Apps Script sources are retained as migration references.

The old prototype admin remains disabled. Real content administration needs secure server authentication, authorization and storage; current content updates use reviewed Git changes.

## Design and content

The public design follows CICA branding and a warm community/family direction inspired by Growlio’s editorial layout. Shared tokens, responsive navigation and reduced-motion behavior are defined in app/globals.css. Logo derivatives are sized for static hosting; preserve original logo proportions. Do not publish sample endorsements, unsourced statistics, fabricated dates or generic photos presented as CICA events. Current event details come from organizers and CricClubs; specific tournament rules defer to official documents.

The curved hero ribbon interleaves CICA, team and sponsor logos. Three portrait photographs rotate every six seconds with manual controls; the current photograph stays visible until the next loads. Home and Sponsors feature premium placements configured in `lib/premium-sponsors.ts` (GPT and Lumin Innovations, plus an inquiry space), a regular sponsor spotlight and continuously moving logo strips. The shared motion control pauses automatic movement across routes; system reduced-motion preferences disable it. Hero rotation and sponsor spotlight cycling pause during pointer or keyboard interaction, while decorative sponsor strips continue. Ten authentic community photographs appear in the keyboard-accessible Gallery; see [photo provenance and sizing](docs/community-imagery.md).

The domain and DNS remain at GoDaddy; website and mail hosting remain at Namecheap. Website and mail A records use `192.64.118.48`, while SPF preserves the provider's separate outbound IP. The deployment does not change mailbox settings or renew SSL/hosting subscriptions.

Issues [#1](https://github.com/Ramc4685/cica-website/issues/1), [#2](https://github.com/Ramc4685/cica-website/issues/2) and [#3](https://github.com/Ramc4685/cica-website/issues/3) track the security, deployment and UI corrections. Historical sample news/testimonials were removed from public presentation.
