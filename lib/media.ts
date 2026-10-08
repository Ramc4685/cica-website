import manifest from "@/lib/generated/media-manifest.json"

export interface MediaVariant { src: string; width: number; height: number }
export interface MediaEntry { width: number; height: number; full: MediaVariant; gallery: MediaVariant }

const entries = manifest as Record<string, MediaEntry>

/** Dimensions and optimized derivatives for a content image, produced by scripts/build-media.mjs. */
export function mediaFor(src: string): MediaEntry {
  const entry = entries[src]
  if (!entry) throw new Error(`Missing media for ${src}; run pnpm media`)
  return entry
}

/** Public URL for a logo: editor uploads use their optimized copy, committed site images are used as they are. */
export function logoUrl(src: string): string {
  return src.startsWith("/uploads/") ? mediaFor(src).gallery.src : src
}

/** Small tile version: committed logos have a pre-made small copy; uploads use the optimized copy. */
export function smallLogoUrl(src: string): string {
  return src.startsWith("/images/") ? src.replace("/images/", "/images/logos-sm/") : logoUrl(src)
}
