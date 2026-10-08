# Deployment

The site is a static Next.js export served by Namecheap cPanel hosting. No Node.js
process runs on the host; the only server code is the PHP forms handler.

- [CI.md](CI.md): the GitHub Actions pipeline (`.github/workflows/namecheap.yml`),
  staging and production release flow, one-time setup and secrets, what the
  installer does, rollback, and what to check when a deploy fails.
- [../docs/forms/namecheap.md](../docs/forms/namecheap.md): the forms handler,
  where submissions are stored, limits, and managing records over SSH.
- [../docs/content-editing.md](../docs/content-editing.md): editing content with
  Pages CMS, which publishes to production without approval.

Files here:

| File | Purpose |
| --- | --- |
| `classify-change.mjs` | Decides whether a `main` push changed only `content/` since what production serves |
| `prepare-release.mjs` | Writes `deployment.json` and the ownership manifest `.cica-manifest` into `out/` |
| `validate-static.mjs` | Checks the export: required pages, assets, safe paths, disabled admin |
| `deploy-namecheap.sh` | Runs in Actions: uploads the artifact over SSH, installs it, verifies HTTPS and the forms handler |
| `install-release.sh` | Runs on the host: backs up, installs, retires old owned files, rolls back on error |
| `namecheap.htaccess` | Copied to `out/.htaccess`: HTTPS/host redirect to https://cicainfo.com, HSTS, caching, compression |
| `tests/` | `node --test deploy/tests/*.test.mjs` |

Never upload source, `.env`, `node_modules`, `.next`, private keys or backup
archives to a public document root.
