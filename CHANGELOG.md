# Changelog

## Unreleased

- Champions: seasons are ordered newest first automatically, so organizers can add a winner anywhere in the list, and a season entered twice for one competition stops the build with a message naming it.
- Fix the 10px sideways scroll on 320px phones by tightening the header spacing at 360px and below; a Cypress spec checks 320, 375 and 390px.
- Organizers can update champions (with optional team photos), community photos, tournament details, announcements, events and FAQ through Pages CMS; uploads are validated and optimized at build (originals stay unpublished; only metadata-free WebP copies ship), and edits go live after the owner approves the production deploy.
- Replace the About banner photo with a wall of all seven CICA identities in their transparent, blue and yellow treatments; its motion stops under reduced motion and the site Pause control.
- Remove the retired Google Apps Script form handlers, their live-endpoint test scripts, handler tests and Sheet templates now that the web apps are undeployed.
- Add a staging site at staging.cicainfo.com: every `main` build deploys there first, and production deploys the same artifact only after an approver signs off. Staging forms keep separate records and `[STAGING]` notifications.
- Add bylaws and indoor rules pages reproducing the official documents verbatim, with a sticky contents list, print and PDF copies.
- Rebuild the home page and site chrome in the Growlio style: tag-dot intros, capsule CTAs, soft cards, Goudy display type at its loaded 400 weight and a footer call to action that never links to its own page.
- Unify the join, contact and sponsor forms in one restyled form with stronger focus rings, a capsule submit button and a no-JavaScript POST fallback.
- Move champions, season and premium-sponsor data into typed modules; unconfirmed results, venues, tier benefits and registration show honest "to be confirmed" states instead of invented facts.
- Meet WCAG AA text contrast on every competition card, add context to repeated link text, and provide a no-JavaScript mobile menu.
- Add app icons, a web manifest and sitemap dates; harden the Namecheap deploy checks and unify Cypress e2e specs.
- Remove the old sponsor spotlight, unused shadcn UI primitives and the legacy editorial panels.
- Rotate twenty authentic community hero photos in full-frame layouts with load-safe fades and manual controls; reserve premium sponsor placements for GPT and Lumin Innovations, with an additional sponsorship invitation.
- Keep sponsor logo strips moving during card interaction while preserving the global Pause control and reduced-motion preference.

- Match the Growlio reference more closely with a curved team ribbon, dark story sections and a large footer composition.
- Add authentic owner-supplied community photography to the homepage and a ten-photo gallery with keyboard-accessible enlargement.
- Animate CICA, team and sponsor identities along the hero ribbon and provide a site-wide pause control and reduced-motion support.

- Redesign the public website around CICA branding, warm editorial typography, clearer participation paths and accessible motion.
- Replace sample news, endorsements and unverified counters with authentic community links; preserve leadership and champions archives.
- Add Get Involved and privacy pages, unique route metadata, a sitemap and correctly sized sharing artwork.
- Optimize logo assets and remove the eager homepage portal.
- Move all three forms to a same-origin Namecheap PHP handler with private records, organizer notifications, server validation and submission limits.
- Improve form accessibility, international name support, optional phone fields and persistent success/failure feedback.
- Add a working lint gate and PHP backend regression checks to CI.

## 2026-10-07 (PR #4, consolidated auto-deploy)

- Add an optional static build for Namecheap cPanel hosting, with directory routes and Apache response headers.
- Use cicainfo.com for absolute social preview image URLs.
- Remove the exposed demo admin password and browser-only login; display unavailable notices on the existing admin URLs.
- Add checked GitHub Actions builds and SSH deployment to Namecheap, including backups and retirement of old generated JavaScript.
- Fix broken public links, missing footer assets, mobile menu access and narrow-screen action buttons.
- Preserve the existing contact, join and sponsorship Apps Script forms, with passing submission and navigation regression tests.
- Enforce TypeScript build validation and repair theme provider children typing.
- Consolidate work into the existing Mac checkout, repair Jest/pnpm configuration, and update Next.js to the patched 15.5.27 release.
- Fix Apps Script browser form requests to avoid unsupported CORS preflight, with mocked request and response regression coverage.
