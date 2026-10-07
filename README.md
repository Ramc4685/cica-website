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

The contact, updates (join) and sponsorship forms submit JSON to a same-origin PHP backend on Namecheap, `public/forms/submit.php`. Requests are validated and saved privately outside the public website folder, with notifications to the organizers. Read [hosted form operation](docs/forms/namecheap.md) for storage, limits, testing and delivery verification. Component tests mock the request; `php tests/forms-backend.php` checks validation and private persistence without sending mail. The former Apps Script handlers under `scripts/apps-scripts/` are no longer called and will be removed once their web app deployments are retired.

The previous admin interface disclosed a demo password and its editing controls did not persist changes. Both admin URLs now display an unavailable notice. The hardcoded NextAuth API and session provider were removed because they were insecure and incompatible with static cPanel hosting. Real content administration needs server-side authentication, authorization and storage.

The domain and DNS remain at GoDaddy; website and mail hosting remain at Namecheap. Website and mail A records use `192.64.118.48`, while SPF preserves the provider's separate outbound IP. The deployment does not change mailbox settings or renew SSL/hosting subscriptions.

Issues [#1](https://github.com/Ramc4685/cica-website/issues/1), [#2](https://github.com/Ramc4685/cica-website/issues/2) and [#3](https://github.com/Ramc4685/cica-website/issues/3) track the security, deployment and UI corrections. Historical sample news/testimonials were preserved pending authoritative content updates.
