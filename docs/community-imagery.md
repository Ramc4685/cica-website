# CICA community photography

The owner supplied and approved CICA photographs (owner-supplied originals, kept offline) for publication on the website and Gallery on October 7, 2026, and asked on October 8, 2026 for every usable photograph to appear in the Gallery. Originals remain unchanged. All twenty-nine community photographs in the collection are in the Gallery, and twenty-four of them rotate in the home page banner. Unrelated documents, auction roster graphics (they list player names and points), match-day promotional posters and video were not imported.

## Selected photograph manifest

The collection contains 57 JPEGs (22.54 MB) with no byte-identical duplicates. Filenames are retained here for provenance; their dates are not asserted as capture dates or tournament dates. Captions describe visible scenes without inventing player names, competition titles or championship results.

| Public asset ID | Original source filename | Full derivative dimensions | Full derivative size |
|---|---|---|---|
| outdoor-award | PHOTO-2022-07-31-20-06-06.jpg | 1200 × 1600 | 232 KiB |
| outdoor-teams | PHOTO-2022-09-10-23-20-13.jpg | 1024 × 768 | 128 KiB |
| indoor-community | PHOTO-2023-03-05-12-44-20.jpg | 1200 × 904 | 207 KiB |
| family-celebration | PHOTO-2023-03-05-12-44-24.jpg | 1200 × 904 | 272 KiB |
| team-gathering | PHOTO-2023-06-18-18-49-12.jpg | 1200 × 675 | 208 KiB |
| indoor-team-celebration | PHOTO-2024-05-06-17-27-14.jpg | 1200 × 900 | 252 KiB |
| community-on-field | PHOTO-2024-09-14-23-46-52.jpg | 1200 × 507 | 109 KiB |
| trophy-presentation | PHOTO-2025-02-23-16-13-38 2.jpg | 1200 × 675 | 188 KiB |
| indoor-team-portrait | PHOTO-2025-04-20-16-12-49 2.jpg | 1200 × 675 | 252 KiB |
| indoor-team-gathering | PHOTO-2025-04-20-16-12-50.jpg | 1200 × 675 | 184 KiB |
| outdoor-bat-presentation | PHOTO-2022-07-31-13-11-38.jpg | 1200 × 1600 | 263 KiB |
| indoor-trophy-moment | PHOTO-2023-03-05-12-44-23.jpg | 1200 × 1594 | 361 KiB |
| friends-at-the-ground | PHOTO-2022-08-07-11-36-57.jpg | 1024 × 768 | 104 KiB |
| outdoor-trophy-gathering | PHOTO-2022-08-21-22-28-34.jpg | 1200 × 900 | 151 KiB |
| indoor-blue-team | PHOTO-2024-05-06-17-27-14 2.jpg | 1200 × 900 | 217 KiB |
| indoor-teams-together | PHOTO-2024-05-06-17-27-15.jpg | 1200 × 900 | 210 KiB |
| outdoor-team-and-trophies | PHOTO-2024-07-01-10-17-32 2.jpg | 1200 × 675 | 188 KiB |
| outdoor-team-lineup | PHOTO-2024-07-01-10-17-32.jpg | 1200 × 675 | 172 KiB |
| outdoor-red-team | PHOTO-2024-07-01-10-17-33.jpg | 1200 × 675 | 179 KiB |
| outdoor-community-teams | PHOTO-2024-09-14-09-45-24.jpg | 1200 × 900 | 159 KiB |
| dome-community-gathering | PHOTO-2025-02-23-16-13-26.jpg | 1200 × 900 | 293 KiB |
| outdoor-navy-team | PHOTO-2024-09-14-09-45-25 2.jpg | 1200 × 900 | 153 KiB |
| outdoor-sky-blue-team | PHOTO-2024-09-14-09-45-25.jpg | 1200 × 900 | 169 KiB |
| indoor-turf-celebration | PHOTO-2025-04-20-16-12-49.jpg | 1200 × 900 | 329 KiB |
| trophy-table-lineup (Gallery only) | PHOTO-2025-02-23-16-13-38.jpg | 1200 × 675 | 177 KiB |
| trophy-handover (Gallery only) | PHOTO-2025-02-23-16-30-12.jpg | 1200 × 900 | 157 KiB |
| sunset-trophies (Gallery only) | PHOTO-2024-10-07-17-08-06.jpg | 1200 × 1600 | 257 KiB |
| indoor-practice-batting (Gallery only) | PHOTO-2023-05-03-10-18-05 2.jpg | 1200 × 1600 | 182 KiB |
| indoor-practice-crease (Gallery only) | PHOTO-2023-05-03-10-18-05.jpg | 1200 × 1600 | 164 KiB |

The committed files are `public/images/community/{id}.webp`: metadata-free WebP at quality 78, at most 1200 pixels on the long side (the portrait photos fit within 1200 × 1600). No photo is enlarged or permanently cropped. These are sources, not what visitors download: `pnpm media` (`scripts/build-media.mjs`) turns every image referenced in `content/photos.json` into a full copy (at most 1600 px) and a Gallery thumbnail (at most 640 px), both WebP at quality 80, in the git-ignored `public/_media/`, and records their sizes in `lib/generated/media-manifest.json`. "Gallery only" in the table is the state at import; the current flags live in `content/photos.json`. The ten `{id}-gallery.webp` files in the same folder are thumbnails from before `pnpm media` existed; nothing references them.

## Integration contract

`content/photos.json` is the source of truth: each entry's `gallery` and `hero` flags decide where it appears, and organizers change them in Pages CMS ("Show on the Gallery page" and "Show in the home page banner"). New photos uploaded there land in `content/uploads/photos/` and are never published as originals.

`lib/community-photos.ts` exports `communityPhotos` (the Gallery photos), each with `id`, `src`, `width`, `height`, `alt`, `caption`, `gallerySrc`, `galleryWidth`, `galleryHeight` and `objectPosition`, plus `heroPhotos` (the banner, in file order; `outdoor-award`, `outdoor-bat-presentation` and `indoor-trophy-moment` are currently first) and `photoById`. Use gallery sources for lazy-loaded thumbnails and full sources when visitors enlarge a photo. Preserve natural proportions in the lightbox; review responsive crops in composed feature panels.

Some IDs are referenced in code, so never rename them: `family-celebration` and `community-on-field` (`aboutPhotoIds`, used on Home), `outdoor-award` (`heroPhoto`), `family-celebration` (Get involved header), `outdoor-teams` (Tournaments header), and `indoor-community`, `team-gathering`, `outdoor-teams` and `community-on-field` (the Home "how to join" steps in `components/sections/join-steps.ts`). A missing ID falls back to the first Gallery photo, except in the join steps, where that step simply shows no photo.

Hero rotation should display the full photograph, including wide group photographs, rather than crop out people to fill a portrait frame. Rotation retains the displayed frame until the requested frame loads, and already loaded frames can be revisited without waiting for another load event.

## Premium sponsor logo

The owner assigned GPT and Lumin Innovations to premium placements and supplied the Lumin Innovations long logo (owner-supplied original, kept offline). Its public derivative is `public/images/sponsors/lumin-innovations.webp` (1260 × 419, 14.5 KiB, quality 85). Original proportions and dark background are preserved. Names, optional logos, optional approved links and display order are edited in `content/sponsors.json` (`premiumSponsors`) and read by `lib/premium-sponsors.ts`. The Sponsors page has three placements filled in list order; an empty one shows a sponsorship invitation.

No external photographs or generated people are represented as CICA community photography. Decorative artwork remains distinct from these actual owner-supplied photographs.
