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

All full derivatives are `public/images/community/{id}.webp`. Gallery thumbnails are `public/images/community/{id}-gallery.webp`, with a maximum dimension of 640 pixels. Full photos have a maximum dimension of 1200 pixels, except the three portrait hero photographs, which fit within 1200 × 1600 while preserving their composition. No photo is enlarged or permanently cropped.

The thirty photo derivatives total 4.70 MB: twenty full photographs and ten gallery thumbnails. The initial hero is 232 KiB; the other hero photos load on demand as visitors rotate through them. All ten gallery thumbnails together total 557 KiB. WebP quality is 78 for full images and 76 for thumbnails. EXIF, XMP, IPTC, ICC and orientation metadata are absent from every public derivative, so original location and camera metadata are not published.

## Integration contract

`lib/community-photos.ts` exports `communityPhotos`, including each photograph's `id`, `src`, `width`, `height`, `alt`, `caption`, `gallerySrc`, `galleryWidth` and `galleryHeight`. Use gallery sources for lazy-loaded thumbnails and full sources when visitors enlarge a photo. Preserve natural proportions in the lightbox; review responsive crops in composed feature panels.

`content/photos.json` is the source of truth: each entry's `gallery` and `hero` flags decide where it appears, and organizers change them in Pages CMS ("Show on the Gallery page" and "Show in the home page banner"). `heroPhotos` keeps `outdoor-award`, `outdoor-bat-presentation` and `indoor-trophy-moment` as the first three frames. New photographs added on October 8, 2026 are metadata-free WebP files at quality 78 under `public/images/community/`; Gallery thumbnails for every photo are built into `public/_media` by `pnpm media`. The intended About pair is `family-celebration` and `community-on-field`.

Hero rotation should display the full photograph, including wide group photographs, rather than crop out people to fill a portrait frame. Rotation retains the displayed frame until the requested frame loads, and already loaded frames can be revisited without waiting for another load event.

## Premium sponsor logo

The owner assigned GPT and Lumin Innovations to premium placements and supplied the Lumin Innovations long logo (owner-supplied original, kept offline). Its public derivative is `public/images/sponsors/lumin-innovations.webp` (1260 × 419, 14.5 KiB, quality 85). Original proportions and dark background are preserved. `lib/premium-sponsors.ts` controls names, optional logos, optional approved links and display order; the third space remains a sponsorship invitation.

No external photographs or generated people are represented as CICA community photography. Decorative artwork remains distinct from these actual owner-supplied photographs.
