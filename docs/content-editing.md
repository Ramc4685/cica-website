# Editing website content

**Start here: go to cicainfo.com/admin/.** That page lists everything you can change, with a button for each, and a button to open the content editor ([Pages CMS](https://pagescms.org)). There is also a small "Organizer login" link at the bottom of every page. The website itself has no login and no secrets.

## Volunteer guide

### 1. Get access (once)

You do not need a GitHub account. Ask the site owner to invite your email address as a Pages CMS collaborator. Open the invite email, sign in, and choose the CICA website. After that, go to cicainfo.com/admin/ and choose Open the content editor.

Not a volunteer? Anyone can use the small "Suggest an update" link under a section (or in the footer). It opens the contact form with the subject filled in, and the organizers make the change.

### 2. Change something

Open the section on the Organizer tools page, open the item you want (items are folded up and show a readable title), edit it, and press Save. Every field says what it is for and gives an example. Fields marked required must be filled in. If you are unsure, leave an optional field blank and never enter anything an organizer has not confirmed.

Tip: switch on "Show edit links on this device" on the Organizer tools page and an "Edit this section" link appears beside each section on the public pages (only on your device).

| To do this | Open | Recipe |
|---|---|---|
| Post news or an event | Season, events and news | Open Announcements or Events, press the add button, fill in the headline or event name, date and a plain-text message. Links start with https://. |
| Update registration | Tournaments | Open the tournament, set Registration status, the deadline and the registration link. Type a number for overs and squad size, or tbc. |
| Record a winner | Results (champions) | Open the competition, then Seasons and winners, add the year and champion team. Runner-up, note and photo are optional. Enter each season once. Add a photo only with the team's consent and describe it for screen readers. |
| Add a photo | Photos | Add an entry, upload the picture (JPG, PNG or WebP under 10 MB), write a caption and a description for screen readers. Tick "Show on the Gallery page", "Show in the home page banner", or both. |
| Add or change a sponsor | Sponsors | Premium sponsors are the lead placements (at most three). CPL team sponsors need a name and logo. Add a website only once the sponsor has confirmed it. Do not publish prices. |
| Add or rename a CPL team | CPL teams | Add the team name exactly as on its logo and upload the logo (PNG, JPG or WebP). |
| Update a ground or court | Venues | Open the venue and fill in the address, a map link, parking and ground rules. Leave the address blank if it is not confirmed. |
| Change a director or organizer | Board and organizers | Edit the person, or add one with a role and a short factual biography. Update "Roles confirmed for season". |
| Change a link or the organizers' email | Site links | Replace the address, starting with https://. |
| Answer a common question | FAQ | Add the question and a plain-text answer. Check rules-based answers against the rules. |
| Add a testimonial | Season, events and news, then Testimonials | Tick "Speaker gave written consent" only if you hold their written consent. Unticked quotes are never shown. |

Keep each Short ID as lowercase words joined by hyphens, and never change an existing one: the site and other items refer to it. Fields marked "set by the website maintainer" cannot be edited.

### 3. When is it live?

Press Save and your change is checked, then published to https://staging.cicainfo.com and to cicainfo.com automatically, usually within about 10 minutes. There is no separate approval step, so double-check names, dates and links before you save. If a build fails, nothing changes on the live site, and the error names the field to fix (for example `content/champions.json: competitions.0.records.3.photo.alt: Required`). Fix it in the editor and the next build runs by itself.

### 4. Undo

Tell the site owner, or if you are the owner revert the commit in GitHub. A revert of a content edit also publishes automatically. Uploaded pictures can also be replaced in the editor.

Questions: organizers@cicainfo.com.

## For the site owner

1. Sign in at https://app.pagescms.org with GitHub and install the Pages CMS GitHub App on `Ramc4685/cica-website` only.
2. Invite each volunteer by email under the repository's collaborators (https://pagescms.org/docs/configuration/collaborators/). Only you can do this. Remove them at the end of the season.
3. Pages CMS commits as the GitHub App identity (`settings.commit.identity: app` in `.pages.yml`), so volunteer emails never appear in public Git history. Do not change this.
4. After a save, the "CI and Namecheap deployment" workflow validates, builds, deploys to staging and then deploys to production automatically ("Deploy content to production (automatic)"), because only `content/` changed since what production serves. Code changes still wait for your approval, and a content edit made while a code change is waiting also waits, so unapproved code never goes live with it. To pause automatic publishing (for example while volunteers change over), set a required reviewer on the `production-content` environment in GitHub Settings → Environments; edits then wait for approval like code.
5. In GitHub Settings → Environments → `production-content`, set Deployment branches to `main` only. GitHub creates this environment on the first automatic deploy.

## For developers

Content lives in `content/*.json`, parsed by the schemas in `lib/content-schema.ts` and exposed through `lib/*.ts`:

| File | Used by |
|---|---|
| `season.json` | `lib/season.ts`: events, announcements, testimonials (`voices`, shown only with `consent: true`) |
| `tournaments.json`, `champions.json`, `photos.json` | `lib/content.ts`, `lib/champions.ts`, `lib/community-photos.ts` |
| `sponsors.json` | `lib/season.ts` (tiers), `lib/premium-sponsors.ts`, `lib/brand-assets.ts` (CPL sponsors) |
| `teams.json` | `lib/brand-assets.ts` |
| `venues.json` | `lib/season.ts` |
| `board.json` | `app/board/page.tsx` |
| `site.json` | `communityLinks` in `lib/content.ts` |
| `faq.json` | `lib/season.ts` |

CICA's own marks (`cicaIdentities` in `lib/brand-assets.ts`) stay in code. `pnpm media` (also run before `dev`, `typecheck`, `test` and `build:namecheap`) validates every image, writes WebP versions to the git-ignored `public/_media/`, and writes `lib/generated/media-manifest.json`. When you add a key to a JSON file or schema, declare it in `.pages.yml` too: `__tests__/lib/pages-config.test.ts` fails if a key is missing, and `__tests__/lib/cms.test.ts` keeps the `/admin/` links in `lib/cms.ts` in step with the entries in `.pages.yml`. Add new sections there too. Tournament IDs, logos and settings are code-owned and read-only in the forms.

Uploads are JPG, PNG or WebP only, checked by file signature, no larger than 10 MB, and only in `content/uploads/champions`, `content/uploads/photos` or `content/uploads/logos`; SVG, HEIC and renamed files are rejected, and any other file or folder under `content/uploads`, or any `public/uploads` folder, fails the build. Originals are kept out of the published site, which serves only resized WebP copies with camera and location metadata removed. Committed logos under `public/images/{sponsors,teams}` keep working as existing paths. Links must start with `https://`, text fields have length limits, unknown keys are rejected and text is rendered as plain text, never as HTML.

The "Suggest an update" links go to `/contact/?topic=update#contact-form`, which prefills the existing contact form's subject; the server accepts any subject, so `submit.php` is unchanged.

Rules-backed FAQ answers in `content/faq.json` were written from the documents in `lib/documents.ts` (general = CICA Playing Conditions and Rules; indoor2025 = CICA Indoor 2025; cplIndoor2025 = 2025 CPL Indoor Tournament Rules). Check an answer against its source before changing it: registering a team (general, Registration Fees), overs (general, Length of the Game; indoor2025; cplIndoor2025), fees (general, Registration Fees), adding or replacing a player (general, Registration Fees and Registering a New Player / Replacement of Player), playoff eligibility (general, Registering a New Player; indoor2025, Roster; cplIndoor2025, Player Requirements), complaints (general, Protest/Complaint), fixtures and scores (general, Score sheets).
