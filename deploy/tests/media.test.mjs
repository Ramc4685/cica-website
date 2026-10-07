import assert from "node:assert/strict"
import test from "node:test"
import { MAX_UPLOAD_BYTES, checkUpload, collectImageSources, sniffImageType } from "../../scripts/media-checks.mjs"

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
