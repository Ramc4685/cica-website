import { createHash } from "node:crypto"
import { lstat, open, readdir, stat } from "node:fs/promises"
import path from "node:path"

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

export function collectImageSources({ champions, photos, teams = {}, sponsors = {} }) {
  const sources = new Set()
  for (const competition of champions.competitions ?? []) for (const record of competition.records ?? []) if (record.photo?.src) sources.add(record.photo.src)
  for (const photo of photos.photos ?? []) if (photo.src) sources.add(photo.src)
  // Logos: only editor uploads need processing; committed site logos under /images are served as they are.
  const logos = [...(teams.teams ?? []), ...(sponsors.cplSponsors ?? []), ...(sponsors.premiumSponsors ?? [])]
  for (const item of logos) if (item.logo?.startsWith("/uploads/")) sources.add(item.logo)
  return [...sources]
}

/** Derivative file name that is unique per source path ("a.b.jpg" and "a-b.jpg" must not collide). */
export function derivativeName(src, max) {
  const slug = src.replace(/^\//, "").replace(/[/.]/g, "-")
  const hash = createHash("sha1").update(src).digest("hex").slice(0, 8)
  return `${slug}-${hash}-${max}.webp`
}

export const UPLOAD_FOLDERS = ["champions", "photos", "logos"]

/**
 * Scans the original-uploads tree (content/uploads) and returns organizer-readable problems.
 * Only the champions, photos and logos folders, holding plain image files, are allowed; originals must
 * never sit under public/ because they would ship with their EXIF metadata.
 */
export async function checkUploadTree(root) {
  const errors = []
  const uploadsDir = path.join(root, "content", "uploads")
  if (await lstat(path.join(root, "public", "uploads")).catch(() => null)) {
    errors.push("public/uploads: originals must live in content/uploads so they are not published; move the files there")
  }
  for (const entry of await readdir(uploadsDir, { withFileTypes: true }).catch(() => [])) {
    if (entry.name === ".gitkeep" && entry.isFile()) continue
    if (!UPLOAD_FOLDERS.includes(entry.name) || !entry.isDirectory()) errors.push(`uploads/${entry.name}: only the champions, photos and logos folders are allowed`)
  }
  for (const folder of UPLOAD_FOLDERS) {
    const dir = path.join(uploadsDir, folder)
    for (const entry of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
      if (entry.name === ".gitkeep") continue
      if (!entry.isFile()) { errors.push(`uploads/${folder}/${entry.name}: only image files are allowed here`); continue }
      const file = path.join(dir, entry.name)
      const handle = await open(file)
      const head = Buffer.alloc(16)
      await handle.read(head, 0, 16, 0)
      await handle.close()
      const problem = checkUpload({ name: entry.name, size: (await stat(file)).size, head })
      if (problem) errors.push(`uploads/${folder}/${problem}`)
    }
  }
  return errors
}
