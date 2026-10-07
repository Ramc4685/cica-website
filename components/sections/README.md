# Cricket section components

Shared, page-level sections for the Growlio-direction redesign. Each renders a complete
`<section aria-labelledby>` with a `SectionIntro` (tag row, display serif heading, optional
subtitle) and its own `*.module.css`. Every section takes `tag`, `title`, `subtitle` (where it
makes sense), `headingId` and `className`, so you can retitle it per page. Pass a unique
`headingId` when the same section appears twice on a page.

When a section sits straight under a `PageHero`, pass `introVariant="label"` (`ChampionsShowcase`,
`PathwayCards`) or `variant="label"` (`SectionIntro`). The tag row then becomes the section's small h2 and
the display heading is dropped, so the hero stays the only display headline above the first content block.

The data comes from `lib/`. Placeholders are never presented as facts. A `tbc` status,
empty benefits, missing addresses, empty event lists and empty quote lists all render an
honest "confirmed by organizers" state, or nothing at all.

| Component | Import | Kind | Key props | Use on |
| --- | --- | --- | --- | --- |
| `CompetitionCards` | `@/components/sections/competition-cards` | server | `tournaments?`, `variant?: "home" \| "page"` | Home (`home`: each card links to `/tournaments/#<id>`) and `/tournaments` (`page`: each card has an anchor `id` and a Register link when registration is open with a URL, otherwise "Ask an organizer") |
| `ChampionsShowcase` | `@/components/sections/champions-showcase` | client | `competitions?`, `variant?: "full" \| "compact"` | `/champions` (`full`: tabs, feature card and season table) and the home "Recent champions" section (`compact`: only competitions with records, plus a capsule to `/champions/`) |
| `HowToJoin` | `@/components/sections/how-to-join` | client | `steps?` (defaults to `joinSteps` from `./join-steps`) | Home process band, `/get-involved` |
| `MetricsStrip` | `@/components/sections/metrics-strip` | server | `metrics?` (defaults to `getMetrics()`), `label?` | Directly under `HowToJoin` on home, or on `/about` |
| `CricketFaq` | `@/components/sections/cricket-faq` | client | `items?` (defaults to `faq` from `lib/season`) | Home, `/tournaments`, `/rules` |
| `SponsorTiers` | `@/components/sections/sponsor-tiers` | server | `tiers?` | `/sponsors`, above the form |
| `PathwayCards` | `@/components/sections/pathway-cards` | server | `items?` (defaults to `pathways`) | `/get-involved` |
| `WhereWePlay` | `@/components/sections/where-we-play` | server | `venues?` | `/tournaments`, `/about` |
| `UpcomingSeason` | `@/components/sections/upcoming-season` | server | `events?`, `venues?` | Home or `/tournaments` |
| `Voices` | `@/components/sections/voices` | server | `voices?` | Home (between champions and FAQ), `/get-involved`. Renders `null` until consented quotes exist |

## Behaviour notes

- **Tabs** (`ChampionsShowcase`, `HowToJoin`) use `useRovingTabs` from `./use-roving-tabs`, which follows the WAI-ARIA tabs pattern with selection following focus. Arrow keys wrap, and Home/End jump to the ends. Steps change only on click or key press, never on scroll. Inactive panels stay in the HTML with the `hidden` attribute.
- **CompetitionCards** cycles through the green, mint-deep, ball and pitch tones. Mint-deep and pitch cards use ink text and an ink capsule. At 1024px and wider, and only while `html[data-motion=running]` is set and reduced motion is not requested, cards overlap with a short `position: sticky` offset. Scrolling is never pinned or hijacked.
- **MetricsStrip** is a static, centered, wrapped row by default. It becomes a CSS marquee only while `html[data-motion=running]` is set and reduced motion is not requested, and it pauses on hover or focus. The duplicate run is `aria-hidden`.
- **CricketFaq** shows two cards at 900px and wider: green questions on the left (buttons with `aria-controls`/`aria-expanded`) and a white answer card on the right. Below 900px it uses native `<details>`. Both layouts end with "Still unsure? Ask an organizer." and a capsule to `/contact/`.
- **SponsorTiers** links each "Ask about this tier" capsule to `sponsorTierHref(id)`, which builds `/sponsors/?interest=<tier id>#sponsor-form`. The sponsor form can turn that value back into a readable tier with `sponsorTierFromInterest(value)?.name`, and it needs a `#sponsor-form` anchor. No prices are shown. Premium is always the green card.
- **TierCard / TierCardStack** (`./tier-card`) is the shared horizontal-card layout used by `SponsorTiers` and `PathwayCards`: name, one line and a capsule on the left, square-dot bullets on the right, and a single featured green card. A card with no bullets drops the right column instead of repeating filler copy (sponsor tier benefits are still `TODO(organizers)`, and the section subtitle says they are agreed with the organizers).
- **ChampionsShowcase** says which season the records run through, or "Archive last updated <date>" once `recordsUpdated` in `lib/champions.ts` is set. Below 760px the tab pills wrap instead of scrolling sideways.
- **Typography exception:** display text is Goudy Bookletter 1911 at 400. The bylaws and rules group headings ("Section 3: …") deliberately stay in the sans face at 18px semibold, for legibility in long legal text.
- `./competition-meta` holds pure helpers: `buildChampionHighlights`, `registrationLabel`, `formatIsoDate` (UTC), `smallLogo` and the tournament-to-competition id mapping. They are covered by tests in `__tests__/components/sections/`.

## Data still needed from organizers

These are tracked in `lib/` as `TODO(organizers)`: tournament registration status, dates, URLs and format; Mini and Challengers champions; sponsor tier benefits; venue addresses and map links; season events; and consented quotes. The sections update on their own once that data is filled in.
