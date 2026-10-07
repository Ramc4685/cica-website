import assert from "node:assert/strict"
import test from "node:test"
import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { MAX_UPLOAD_BYTES, checkUpload, checkUploadTree, collectImageSources, derivativeName, sniffImageType } from "../../scripts/media-checks.mjs"

const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0])
const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0])
const webp = Buffer.from("RIFF\0\0\0\0WEBP", "latin1")
const svg = Buffer.from("<svg xmlns='http://www.w3.org/2000/svg'><script>", "utf8")
const html = Buffer.from("<!doctype html><script>", "utf8")

test("sniffs real image bytes", () => {
  assert.equal(sniffImageType(jpeg), "jpeg")
  assert.equal(sniffImageType(png), "png")
  assert.equal(sniffImageType(webp), "webp")
  assert.equal(sniffImageType(svg), null)
})
test("accepts matching uploads within the size cap", () => {
  assert.equal(checkUpload({ name: "team.jpg", size: 1000, head: jpeg }), null)
  assert.equal(checkUpload({ name: "team.JPEG", size: 1000, head: jpeg }), null)
  assert.equal(checkUpload({ name: "team.webp", size: MAX_UPLOAD_BYTES, head: webp }), null)
})
test("rejects SVG, spoofed extensions, unknown types and oversize files", () => {
  assert.match(checkUpload({ name: "logo.svg", size: 10, head: svg }), /JPG, PNG or WebP/)
  assert.match(checkUpload({ name: "team.jpg", size: 10, head: html }), /not a real/)
  assert.match(checkUpload({ name: "team.png", size: 10, head: jpeg }), /do not match/)
  assert.match(checkUpload({ name: "team.heic", size: 10, head: jpeg }), /JPG, PNG or WebP/)
  assert.match(checkUpload({ name: "team.jpg", size: MAX_UPLOAD_BYTES + 1, head: jpeg }), /10 MB/)
})
test("collects every image referenced by content", () => {
  const sources = collectImageSources({
    champions: { competitions: [{ records: [{ photo: { src: "/uploads/champions/a.jpg" } }, {}] }] },
    photos: { photos: [{ src: "/images/community/b.webp" }] },
  })
  assert.deepEqual(sources.sort(), ["/images/community/b.webp", "/uploads/champions/a.jpg"])
})

test("derivative names stay unique for sources that differ only by dot or hyphen", () => {
  assert.notEqual(derivativeName("/uploads/photos/a.b.jpg", 1600), derivativeName("/uploads/photos/a-b.jpg", 1600))
  assert.notEqual(derivativeName("/uploads/photos/a.jpg", 640), derivativeName("/uploads/photos/a.jpg", 1600))
  assert.equal(derivativeName("/uploads/photos/a.jpg", 640), derivativeName("/uploads/photos/a.jpg", 640))
})

async function stage(files) {
  const root = await mkdtemp(path.join(os.tmpdir(), "cica-uploads-"))
  for (const [name, body] of Object.entries(files)) {
    await mkdir(path.dirname(path.join(root, name)), { recursive: true })
    if (body !== null) await writeFile(path.join(root, name), body)
  }
  return root
}

test("upload tree accepts only valid images in champions and photos", async () => {
  const root = await stage({ "content/uploads/champions/a.jpg": jpeg, "content/uploads/photos/.gitkeep": "" })
  try { assert.deepEqual(await checkUploadTree(root), []) } finally { await rm(root, { recursive: true, force: true }) }
})

test("upload tree rejects stray files, extra folders, fake images and published originals", async () => {
  const root = await stage({
    "content/uploads/x.jpg": jpeg,
    "content/uploads/champions/.gitkeep": "",
    "content/uploads/champions-old/x.jpg": jpeg,
    "content/uploads/photos/fake.jpg": html,
    "public/uploads/photos/leak.jpg": jpeg,
  })
  try {
    await symlink(path.join(root, "content/uploads/x.jpg"), path.join(root, "content/uploads/champions/link.jpg"))
    const errors = (await checkUploadTree(root)).join("\n")
    assert.match(errors, /uploads\/x\.jpg: only the champions and photos folders/)
    assert.match(errors, /champions-old/)
    assert.match(errors, /fake\.jpg: not a real/)
    assert.match(errors, /public\/uploads/)
    assert.match(errors, /champions\/link\.jpg: only image files/)
  } finally { await rm(root, { recursive: true, force: true }) }
})
