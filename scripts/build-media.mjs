import { mkdir, open, readdir, readFile, stat, writeFile } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"
import { checkUpload, collectImageSources } from "./media-checks.mjs"

const root = process.cwd()
const publicDir = path.join(root, "public")
const outDir = path.join(publicDir, "_media")
const manifestFile = path.join(root, "lib/generated/media-manifest.json")
const readJson = async file => JSON.parse(await readFile(path.join(root, file), "utf8"))
const errors = []

// Every file in public/uploads must be a valid image, including uploads not yet referenced by content.
for (const folder of ["champions", "photos"]) {
  const dir = path.join(publicDir, "uploads", folder)
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

// Every image referenced by content must exist and be valid; build derivatives and the manifest.
const sources = collectImageSources({ champions: await readJson("content/champions.json"), photos: await readJson("content/photos.json") })
await mkdir(outDir, { recursive: true })
await mkdir(path.dirname(manifestFile), { recursive: true })
const manifest = {}
for (const src of sources) {
  const file = path.join(publicDir, src)
  if (!file.startsWith(publicDir + path.sep)) { errors.push(`${src}: invalid path`); continue }
  const info = await stat(file).catch(() => null)
  if (!info) { errors.push(`${src}: referenced in content but the file is missing`); continue }
  if (!src.startsWith("/uploads/")) {
    // Committed site images are not user uploads, but still must be readable images.
    const handle = await open(file)
    const head = Buffer.alloc(16)
    await handle.read(head, 0, 16, 0)
    await handle.close()
    const problem = checkUpload({ name: path.basename(file), size: info.size, head })
    if (problem) { errors.push(`${src}: ${problem}`); continue }
  }
  const base = src.replace(/^\//, "").replace(/[/.]/g, "-")
  const variant = async max => {
    const name = `${base}-${max}.webp`
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
