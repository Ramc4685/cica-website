# Changelog

## Unreleased

- Keep the cPanel MultiPHP handler block in public_html/.htaccess across deployments so releases no longer reset the web PHP version.
- Add an optional static build for Namecheap cPanel hosting, with directory routes and Apache response headers.
- Use cicainfo.com for absolute social preview image URLs.
- Remove the exposed demo admin password and browser-only login; display unavailable notices on the existing admin URLs.
- Add checked GitHub Actions builds and SSH deployment to Namecheap, including backups and retirement of old generated JavaScript.
- Fix broken public links, missing footer assets, mobile menu access and narrow-screen action buttons.
- Preserve the existing contact, join and sponsorship Apps Script forms, with passing submission and navigation regression tests.
- Enforce TypeScript build validation and repair theme provider children typing.
- Consolidate work into the existing Mac checkout, repair Jest/pnpm configuration, and update Next.js to the patched 15.5.27 release.
- Fix Apps Script browser form requests to avoid unsupported CORS preflight, with mocked request and response regression coverage.
