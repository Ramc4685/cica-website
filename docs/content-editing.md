# Editing website content

Organizers can update champions, community photos, tournament details, announcements, events and the FAQ through [Pages CMS](https://pagescms.org), a hosted editor that works on the files in `content/`. The website itself has no login and no editing code. Every edit is a Git commit to `main`, built and checked like any other change, and **nothing reaches cicainfo.com until the site owner approves the production deploy**.

## For the site owner

### One-time setup

1. Sign in at https://app.pagescms.org with GitHub and install the Pages CMS GitHub App on `Ramc4685/cica-website` only (not on every repository).
2. Open the repository in Pages CMS. The forms come from `.pages.yml` in the repository root.
3. Under the repository's collaborators in Pages CMS, invite each volunteer by email. They sign in from the invite. Remove them at the end of the season.
4. Pages CMS commits as the GitHub App identity (`settings.commit.identity: app` in `.pages.yml`), so volunteer emails never appear in public Git history. Do not change this.

### What happens after someone saves

1. Pages CMS commits to `main`.
2. The "CI and Namecheap deployment" workflow validates the content and uploads, builds, and deploys automatically to https://staging.cicainfo.com.
3. The production job waits for you. Review staging, then go to GitHub, Actions, "CI and Namecheap deployment", open the run, choose Review deployments, tick Production, and approve. Rejecting or ignoring it leaves the live site unchanged.

### Undo, and when a build fails

To undo a change, revert the commit in GitHub. The revert flows through staging and your approval the same way.

If a build fails, the Actions log names the content field or upload to fix, for example `content/champions.json: competitions.0.records.3.photo.alt: Required`. Fix it in Pages CMS (or ask the volunteer to), and the next build runs on its own. Production is never touched by a failed build.

### What the build enforces

Uploads are JPG, PNG or WebP only, checked by file signature, no larger than 10 MB, and only in `content/uploads/champions` or `content/uploads/photos`; any other file or folder under `content/uploads`, or any `public/uploads` folder, fails the build. Originals are kept out of the published site, which serves only resized WebP copies with camera and location metadata removed. SVG, HEIC and renamed files are rejected. Links must start with `https://`. Text fields have length limits. Unknown keys are rejected. Text is rendered as plain text, never as HTML.

### Notes behind the FAQ answers

Rules-backed FAQ answers in `content/season.json` were written from the documents in `lib/documents.ts` (general = CICA Playing Conditions and Rules; indoor2025 = CICA Indoor 2025; cplIndoor2025 = 2025 CPL Indoor Tournament Rules). Check an answer against its source before changing it.

- How do I register a team: general, Registration Fees.
- How many overs: general, Length of the Game; indoor2025; cplIndoor2025.
- How are fees paid: general, Registration Fees.
- Add or replace a player: general, Registration Fees and Registering a New Player / Replacement of Player.
- Playoff eligibility: general, Registering a New Player; indoor2025, Roster; cplIndoor2025, Player Requirements.
- Complaint or protest: general, Protest/Complaint.
- Fixtures and scores: general, Score sheets.

### For developers

Content lives in `content/*.json` and is parsed by the schemas in `lib/content-schema.ts`. `pnpm media` (also run before `dev`, `typecheck`, `test` and `build:namecheap`) validates every image, writes WebP versions to the git-ignored `public/_media/`, and writes `lib/generated/media-manifest.json`. When you add a key to a JSON file or schema, declare it in `.pages.yml` too: Pages CMS would otherwise not show it, and `__tests__/lib/pages-config.test.ts` fails if a key is missing. Tournament IDs, logos and settings are code-owned and read-only in the forms.

## For volunteers

You can edit five things. Sign in from the email invite you received at https://app.pagescms.org and choose the CICA website.

- **Champions:** pick a competition, add a season at the top of its list (newest first), and enter the champion exactly as the team name should appear. Runner-up and notes are optional. Only enter results organizers have confirmed. If you leave something unknown, leave it blank.
- **Champion team photo:** optional, per season. Use a JPG, PNG or WebP under 10 MB, and only with the team's consent. A short description of the photo for people using screen readers is required.
- **Community photos:** add a photo, a description, a caption, and tick where it should appear. Keep the Short ID as lowercase words joined by hyphens, and never change an existing ID.
- **Tournaments:** update registration status, dates, links and format. Type a number such as 13 for overs or squad size, or tbc if it is not confirmed.
- **News, events and FAQ:** plain text only. Links must start with https://.

When you press save, your change appears on https://staging.cicainfo.com within a few minutes. It goes live on cicainfo.com after the site owner approves it, so nothing you save goes public straight away. Never enter results, dates or policies you have not confirmed. Questions: organizers@cicainfo.com.
