import { mkdir, open, readFile, stat, writeFile } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"
import { checkUpload, checkUploadTree, collectImageSources, derivativeName } from "./media-checks.mjs"

const root = process.cwd()
const publicDir = path.join(root, "public")
const outDir = path.join(publicDir, "_media")
const manifestFile = path.join(root, "lib/generated/media-manifest.json")
const readJson = async file => JSON.parse(await readFile(path.join(root, file), "utf8"))
const errors = []

// Originals live in content/uploads (never published); every file there must be a valid image, referenced or not.
errors.push(...await checkUploadTree(root))

// Every image referenced by content must exist and be valid; build derivatives and the manifest.
const sources = collectImageSources({ champions: await readJson("content/champions.json"), photos: await readJson("content/photos.json"), teams: await readJson("content/teams.json"), sponsors: await readJson("content/sponsors.json") })
await mkdir(outDir, { recursive: true })
await mkdir(path.dirname(manifestFile), { recursive: true })
const manifest = {}
for (const src of sources) {
  // /uploads/* originals are kept outside public/ so they never ship; everything else is a committed site image.
  const uploaded = src.startsWith("/uploads/")
  const base = uploaded ? path.join(root, "content") : publicDir
  const file = path.join(base, src)
  if (!file.startsWith(base + path.sep)) { errors.push(`${src}: invalid path`); continue }
  const info = await stat(file).catch(() => null)
  if (!info) { errors.push(`${src}: referenced in content but the file is missing`); continue }
  if (!uploaded) {
    // Committed site images are not user uploads, but still must be readable images.
    const handle = await open(file)
    const head = Buffer.alloc(16)
    await handle.read(head, 0, 16, 0)
    await handle.close()
    const problem = checkUpload({ name: path.basename(file), size: info.size, head })
    if (problem) { errors.push(`${src}: ${problem}`); continue }
  }
  const variant = async max => {
    const name = derivativeName(src, max)
    const target = path.join(outDir, name)
    const existing = await stat(target).catch(() => null)
    if (existing && existing.mtimeMs >= info.mtimeMs) {
      const meta = await sharp(target).metadata()
      return { src: `/_media/${name}`, width: meta.width, height: meta.height }
    }
    const { width, height } = await sharp(file).rotate().resize({ width: max, height: max, fit: "inside", withoutEnlargement: true }).webp({ quality: 80 }).toFile(target)
    return { src: `/_media/${name}`, width, height }
  }
  try {
    const full = await variant(1600)
    manifest[src] = { width: full.width, height: full.height, full, gallery: await variant(640) }
  } catch (error) {
    errors.push(`${src}: could not be read as an image (${error.message})`)
  }
}

if (errors.length) {
  console.error(`Media check failed:\n- ${errors.join("\n- ")}`)
  process.exit(1)
}
await writeFile(manifestFile, JSON.stringify(manifest, null, 2) + "\n")
console.log(`Media ready: ${sources.length} images.`)
