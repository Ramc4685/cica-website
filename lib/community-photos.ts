import photosFile from "@/content/photos.json"
import { parseContent, photosFileSchema } from "@/lib/content-schema"
import { mediaFor } from "@/lib/media"

export interface CommunityPhoto {
  id: string
  src: string
  width: number
  height: number
  alt: string
  caption: string
  gallerySrc: string
  galleryWidth: number
  galleryHeight: number
  /** CSS object-position focal point that keeps faces in frame when the photo is cropped with object-fit: cover. */
  objectPosition: string
}

/** Inline style for a cover-cropped community photo; pair with the `.community-photo` class. */
export const photoFocusStyle = (photo: Pick<CommunityPhoto, "objectPosition">) => ({ objectPosition: photo.objectPosition })

// Edited through Pages CMS in content/photos.json; dimensions and optimized files come from scripts/build-media.mjs.
const entries = parseContent(photosFileSchema, photosFile, "photos.json").photos.map(photo => {
  const media = mediaFor(photo.src)
  return {
    gallery: photo.gallery,
    hero: photo.hero,
    photo: {
      id: photo.id,
      src: media.full.src,
      width: media.full.width,
      height: media.full.height,
      alt: photo.alt,
      caption: photo.caption,
      gallerySrc: media.gallery.src,
      galleryWidth: media.gallery.width,
      galleryHeight: media.gallery.height,
      objectPosition: photo.objectPosition,
    } satisfies CommunityPhoto,
  }
})

export const communityPhotos: readonly CommunityPhoto[] = entries.filter(entry => entry.gallery).map(entry => entry.photo)

/** A gallery photo by id, or the first gallery photo when an editor has removed or renamed it. */
export const photoById = (id: string): CommunityPhoto => communityPhotos.find(photo => photo.id === id) ?? communityPhotos[0]

export const heroPhoto = photoById("outdoor-award")
export const heroPhotos: readonly Pick<CommunityPhoto, "id" | "src" | "width" | "height" | "alt" | "caption">[] =
  entries.filter(entry => entry.hero).map(({ photo: { id, src, width, height, alt, caption } }) => ({ id, src, width, height, alt, caption }))
export const aboutPhotoIds = ["family-celebration", "community-on-field"] as const
export const communityFeaturePhotoId = "community-on-field"
