export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
const extensionTypes = { jpg: "jpeg", jpeg: "jpeg", png: "png", webp: "webp" }
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

export function sniffImageType(head) {
  if (head.length >= 3 && head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return "jpeg"
  if (head.length >= 8 && head.subarray(0, 8).equals(PNG_SIGNATURE)) return "png"
  if (head.length >= 12 && head.toString("latin1", 0, 4) === "RIFF" && head.toString("latin1", 8, 12) === "WEBP") return "webp"
  return null
}

/** Returns null when the upload is acceptable, or a message an organizer can act on. */
export function checkUpload({ name, size, head }) {
  const extension = name.includes(".") ? name.split(".").pop().toLowerCase() : ""
  const expected = extensionTypes[extension]
  if (!expected) return `${name}: use a JPG, PNG or WebP image`
  const actual = sniffImageType(head)
  if (!actual) return `${name}: not a real JPG, PNG or WebP image`
  if (actual !== expected) return `${name}: file contents (${actual}) do not match the .${extension} extension`
  if (size > MAX_UPLOAD_BYTES) return `${name}: larger than 10 MB; export a smaller copy and upload again`
  return null
}

export function collectImageSources({ champions, photos }) {
  const sources = new Set()
  for (const competition of champions.competitions ?? []) for (const record of competition.records ?? []) if (record.photo?.src) sources.add(record.photo.src)
  for (const photo of photos.photos ?? []) if (photo.src) sources.add(photo.src)
  return [...sources]
}
