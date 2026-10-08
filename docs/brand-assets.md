# CICA / CPL artwork inventory

The owner supplied and approved publication of the CICA artwork, CPL team logos and sponsor artwork from the local CICA folder on October 7, 2026. Originals remain unchanged in that folder. Public images are optimized WebP derivatives; no roster, spreadsheet or contact-list data was copied.

## CICA identity family

The 21 PNGs are seven identities in transparent, blue-background and yellow-background treatments. The transparent treatment is used across the website. The blue- and yellow-background treatments are published as 360×360 WebP derivatives in `public/images/logos-family/` for the About page family wall, where each identity appears once per treatment; they are the same identities, not additional ones.

| Identity | Transparent source | Alternate backgrounds | Public derivative | Blue / yellow derivatives |
|---|---|---|---|---|
| CICA Tournaments | cricket association-01.png | 02 / 03 | cica-logo-tournaments.webp | cica-logo-tournaments-blue.webp / -yellow.webp |
| CICA Mains | cricket association-04.png | 05 / 06 | cica-logo-mains.webp | cica-logo-mains-blue.webp / -yellow.webp |
| CPL | cricket association-07.png | 08 / 09 | cica-logo-cpl.webp | cica-logo-cpl-blue.webp / -yellow.webp |
| CICA Mini | cricket association-10.png | 11 / 12 | cica-logo-mini.webp | cica-logo-mini-blue.webp / -yellow.webp |
| CICA Indoor | cricket association-13.png | 14 / 15 | cica-logo-indoor.webp | cica-logo-indoor-blue.webp / -yellow.webp |
| CICA 100 | cricket association-16.png | 17 / 18 | cica-logo-100.webp | cica-logo-100-blue.webp / -yellow.webp |
| CICA main identity | cricket association-19.png | 20 / 21 | cica-logo-main.webp | cica-logo-main-blue.webp / -yellow.webp |

Matching JPGs and the `CICA files` subset duplicate this artwork. The transparent logos appear on Gallery, the navigation, the footer and the moving logo ribbon; all three treatments form the About page wall (`components/sections/logo-family-wall.tsx`). The identity list is `cicaIdentities` in `lib/brand-assets.ts`, kept in code rather than in Pages CMS. CICA 100 is presented as supplied artwork, not as an asserted currently open competition.

## CPL team identities

The source filenames and artwork were visually inspected. Each original/transformed pair is one identity; originals were preferred for optimization because the transformed copies enlarge the same art.

| Logo text / display name | Original filename | Public filename under images/teams |
|---|---|---|
| RCS Archrivals | Archrivals.jpg | archrivals.webp |
| Bloom Barista Bulls | BBB.jpg | bloom-barista-bulls.webp |
| Bloom Events Eagles | BloomEvents.jpg | bloom-events-eagles.webp |
| My Craft Barn Challengers | Challengers.jpg | my-craft-barn-challengers.webp |
| GNR Systems Lions | GNR Lions.jpg | gnr-systems-lions.webp |
| GPT Shers | GPTShers.jpg | gpt-shers.webp |
| Techie Brains Legends | TechieBrains.jpg | techie-brains-legends.webp |
| Parke Regency Thalaivas | Thalaivas.jpg | parke-regency-thalaivas.webp |

These committed logos are the starting entries in `content/teams.json`, where organizers can rename teams or upload new logos in Pages CMS (uploads go to `content/uploads/logos/`). Every committed team and sponsor logo also has a small tile copy under `public/images/logos-sm/`. Team names use one canonical title-case spelling across the site (artwork filenames may differ). Display identifies the supplied CPL team collection; current teams, registration and fixtures remain the organizers’ / CricClubs’ responsibility.

## CPL sponsor artwork

| Business represented | Source | Public filename under images/sponsors |
|---|---|---|
| Bloom Barista | BloomBarista-transformed.jpeg | bloom-barista.webp |
| Bloom Barista alternate graphic | Bloom-barista2-transformed.jpeg | bloom-barista-alt.webp |
| Bloom Bazaar | BloomBazar.jpeg | bloom-bazaar.webp |
| Bloom Events | BloomEvents.pdf, page 1 | bloom-events.webp |
| Global Prime Taxation LLC | GPT-transformed.jpeg | global-prime-taxation.webp |
| GNR Systems | GnrSystems-transformed.jpeg | gnr-systems.webp |
| My Craft Barn | myCraftbarn.png | my-craft-barn.webp |
| Parke Regency Hotel & Conference Center | Parke-Regency-transformed.jpeg | parke-regency.webp |
| Techie Brains Inc. | TechieBrains-unYEJin7m-transformed.jpeg | techie-brains.webp |
| Lumin Innovations (premium sponsor) | supplied separately; see [community-imagery.md](community-imagery.md#premium-sponsor-logo) | lumin-innovations.webp |

Which sponsors appear, and where, is edited in `content/sponsors.json` (`premiumSponsors` and `cplSponsors`). Bloom Barista has two supplied treatments of one business; the primary horizontal treatment is displayed once in sponsor strips. The alternate derivative is not referenced anywhere and is kept for future use. Business website links were not invented or inferred from artwork. Sponsor display describes the supplied CPL sponsor collection, without asserting current contracts, tiers or benefits.

## Photos / video

This artwork collection contained no community photography; the photographs supplied later are documented in [community-imagery.md](community-imagery.md). The `Adv` video folder contains advertising files and is not treated as match footage.

The 1200×630 social sharing card (`public/images/cica-social.webp`) is a composed CICA brand card, not a community photograph. Original files stay outside the repository; only the WebP derivatives are committed.
