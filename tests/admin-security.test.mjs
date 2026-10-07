import assert from "node:assert/strict"
import { access, readFile, readdir } from "node:fs/promises"
import path from "node:path"
import test from "node:test"

const root = process.cwd()
const adminFiles = ["app/admin/page.tsx", "app/admin/login-info.tsx", "app/admin-login/page.tsx"]

test("public admin routes offer no client authentication or editing controls", async () => {
  const sources = await Promise.all(adminFiles.map((file) => readFile(path.join(root, file), "utf8")))
  for (const source of sources) {
    assert.doesNotMatch(source, /use client|useState|handleLogin|isAuthenticated|type=["']password|<form\b|default password/i)
  }
  assert.match(sources[1], /Administration is unavailable/)
  assert.match(sources[1], /mailto:organizers@cicainfo\.com/)
  for (const route of [sources[0], sources[2]]) {
    assert.match(route, /index: false/)
    assert.match(route, /follow: false/)
  }
  await assert.rejects(access(path.join(root, "app/api/auth/[...nextauth]/route.ts")), { code: "ENOENT" })
  await assert.rejects(access(path.join(root, "app/providers.tsx")), { code: "ENOENT" })
})

// Run against the fresh export in CI to prevent a client login from shipping again.
if (process.env.CICA_TEST_EXPORT_DIR) {
  test("exported admin pages and browser assets contain no exposed demo authentication", async () => {
    const exportRoot = path.resolve(root, process.env.CICA_TEST_EXPORT_DIR)
    const forbidden = /default password|password\s*===|Access Admin Panel|Publish News|Authenticated/gi
    const pending = [exportRoot]
    while (pending.length) {
      const directory = pending.pop()
      for (const entry of await readdir(directory, { withFileTypes: true })) {
        const file = path.join(directory, entry.name)
        if (entry.isDirectory()) pending.push(file)
        else if (/\.(?:html|js|txt)$/.test(entry.name)) {
          assert.doesNotMatch(await readFile(file, "utf8"), forbidden, `Unsafe admin content in ${path.relative(exportRoot, file)}`)
        }
      }
    }
    for (const route of ["admin", "admin-login"]) {
      const html = await readFile(path.join(exportRoot, route, "index.html"), "utf8")
      assert.match(html, /Administration is unavailable/)
      assert.doesNotMatch(html, /<input[^>]+type="password"/i)
      assert.match(html, /name="robots" content="noindex, nofollow"/)
    }
  })
}
