# Namecheap cPanel hosting

Use the checked GitHub Actions pipeline described in [CI.md](CI.md). The Namecheap build is a static export; no Node.js application runs on the host. Pull requests must pass type checking, component/form tests, static export, admin security regressions and deployment validation. Successful main builds publish their exact checked artifact over verified SSH.

For a manual build, use `pnpm install --frozen-lockfile` and `pnpm build:namecheap`, then copy `deploy/namecheap.htaccess` into `out/.htaccess`. Upload only export contents to `/home/cicanrkn/public_html`, retiring old generated bundles too. `deploy/namecheap.htaccess` redirects to https://cicainfo.com, sets HSTS, caching and compression, and the installer merges any cPanel MultiPHP handler block from the existing `.htaccess` into the new one. Prefer the automated installer: it keeps private backups outside the webroot, preserves `.well-known`, `cgi-bin` and unrelated files, normalizes permissions, and rolls back installation errors. Never upload source, `.env`, node_modules, .next, private keys or backup archives to the public root.

Public admin URLs show an unavailable notice. The previous disclosed-password prototype and nonpersistent editor have been removed. Contact, email updates and sponsorship forms post JSON to the same-origin Namecheap PHP endpoint. PHP 8.1 or later must serve `forms/submit.php`; validated submissions are saved outside the webroot and notify organizers. See [form operations](../docs/forms/namecheap.md) for storage, limits and delivery verification.

The site uses the existing Stellar annual hosting subscription. Domain registration/DNS remain at GoDaddy. Website and mail A records use `192.64.118.48`. Website and mail certificates expire April 23, 2027. Website deployments do not change mailboxes, mail routing, DNS or SSL renewal settings.

After deployment, verify the exact commit at `/deployment.json`, trusted HTTPS, direct routes/refreshes, navigation, assets and mobile layouts. Linked Google documents and CricClubs pages depend on those providers' permissions. See [CI.md](CI.md) for activation, ownership manifests and rollback details.
