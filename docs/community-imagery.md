# CICA community photography

The owner supplied and approved CICA photographs from `/Users/ramc/Downloads/Cica_Photos` for publication on the website and Gallery on October 7, 2026. Originals remain unchanged. Only the ten selected photographs listed below were imported; unrelated documents, roster graphics, advertising material and video were not imported.

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

All full derivatives are `public/images/community/{id}.webp`. Gallery thumbnails are `public/images/community/{id}-gallery.webp`, with a maximum dimension of 640 pixels. Full photos have a maximum dimension of 1200 pixels, except the portrait hero, which preserves its original 1200 × 1600 composition. No photo is enlarged or permanently cropped.

The twenty derivatives total 2.65 MB. The hero is 232 KiB; all ten gallery thumbnails together total 557 KiB. WebP quality is 78 for full images and 76 for thumbnails. EXIF, XMP, IPTC, ICC and orientation metadata are absent from every public derivative, so original location and camera metadata are not published.

## Integration contract

`lib/community-photos.ts` exports `communityPhotos`, including each photograph's `id`, `src`, `width`, `height`, `alt`, `caption`, `gallerySrc`, `galleryWidth` and `galleryHeight`. Use gallery sources for lazy-loaded thumbnails and full sources when visitors enlarge a photo. Preserve natural proportions in the lightbox; review responsive crops in composed feature panels.

`heroPhoto` selects `outdoor-award`; the intended About pair is `family-celebration` and `community-on-field`. The hero's portrait composition works with centered cropping, keeping both cricketers and the trophy visible. A wide landscape crop should use a different supplied image rather than force this portrait into that shape.

No external photographs or generated people are represented as CICA community photography. Decorative artwork remains distinct from these actual owner-supplied photographs.
