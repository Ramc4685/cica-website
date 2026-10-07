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
