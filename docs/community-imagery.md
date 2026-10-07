# CICA community photography

The owner supplied and approved CICA photographs from `/Users/ramc/Downloads/Cica_Photos` for publication on the website and Gallery on October 7, 2026. Originals remain unchanged. Twelve selected photographs were imported: ten in the Gallery and two additional portraits for hero rotation. Unrelated documents, roster graphics, advertising material and video were not imported.

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
| outdoor-bat-presentation (hero only) | PHOTO-2022-07-31-13-11-38.jpg | 1200 × 1600 | 263 KiB |
| indoor-trophy-moment (hero only) | PHOTO-2023-03-05-12-44-23.jpg | 1200 × 1594 | 361 KiB |

All full derivatives are `public/images/community/{id}.webp`. Gallery thumbnails are `public/images/community/{id}-gallery.webp`, with a maximum dimension of 640 pixels. Full photos have a maximum dimension of 1200 pixels, except the three portrait hero photographs, which fit within 1200 × 1600 while preserving their composition. No photo is enlarged or permanently cropped.

The twenty-two photo derivatives total 3.29 MB. The initial hero is 232 KiB; the other hero photos load on demand as visitors rotate through them. All ten gallery thumbnails together total 557 KiB. WebP quality is 78 for full images and 76 for thumbnails. EXIF, XMP, IPTC, ICC and orientation metadata are absent from every public derivative, so original location and camera metadata are not published.

## Integration contract

`lib/community-photos.ts` exports `communityPhotos`, including each photograph's `id`, `src`, `width`, `height`, `alt`, `caption`, `gallerySrc`, `galleryWidth` and `galleryHeight`. Use gallery sources for lazy-loaded thumbnails and full sources when visitors enlarge a photo. Preserve natural proportions in the lightbox; review responsive crops in composed feature panels.

`heroPhotos` selects `outdoor-award`, `outdoor-bat-presentation` and `indoor-trophy-moment`; the intended About pair is `family-celebration` and `community-on-field`. The hero uses portrait compositions with centered cropping. Rotation retains the displayed frame until the requested frame loads, and already loaded frames can be revisited without waiting for another load event.

## Premium sponsor logo

The owner assigned GPT and Lumin Innovations to premium placements and supplied `/Users/ramc/Downloads/Long Logo 2.png` for Lumin Innovations. Its public derivative is `public/images/sponsors/lumin-innovations.webp` (1260 × 419, 14.5 KiB, quality 85). Original proportions and dark background are preserved. `lib/premium-sponsors.ts` controls names, optional logos, optional approved links and display order; the third space remains a sponsorship invitation.

No external photographs or generated people are represented as CICA community photography. Decorative artwork remains distinct from these actual owner-supplied photographs.
