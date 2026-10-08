import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import path from "node:path"
import test from "node:test"
import { isContentOnlyChange } from "../classify-change.mjs"

const before = "a".repeat(40)

test("a push that only changes CMS content publishes automatically", () => {
  assert.equal(isContentOnlyChange({ before, isAncestor: true, files: ["content/venues.json"] }), true)
  assert.equal(isContentOnlyChange({ before, isAncestor: true, files: ["content/champions.json", "content/uploads/champions/team.jpg"] }), true)
})

test("any change outside content/ still needs approval", () => {
  for (const other of [".pages.yml", "lib/content-schema.ts", ".github/workflows/namecheap.yml", "scripts/build-media.mjs", "public/uploads/x.jpg", "contentx/a.json", "app/content/page.tsx"]) {
    assert.equal(isContentOnlyChange({ before, isAncestor: true, files: ["content/venues.json", other] }), false, other)
  }
})

test("unknown history or an empty diff still needs approval", () => {
  assert.equal(isContentOnlyChange({ before: "0".repeat(40), isAncestor: true, files: ["content/venues.json"] }), false)
  assert.equal(isContentOnlyChange({ before: "", isAncestor: true, files: ["content/venues.json"] }), false)
  assert.equal(isContentOnlyChange({ before, isAncestor: false, files: ["content/venues.json"] }), false)
  assert.equal(isContentOnlyChange({ before, isAncestor: true, files: [] }), false)
})

test("paths that try to leave content/ are not content", () => {
  assert.equal(isContentOnlyChange({ before, isAncestor: true, files: ["content/../lib/site.ts"] }), false)
  assert.equal(isContentOnlyChange({ before, isAncestor: true, files: ["content/"] }), false)
})

test("the workflow gates production on the classifier", async () => {
  const workflow = await readFile(path.join(process.cwd(), ".github/workflows/namecheap.yml"), "utf8")
  assert.ok(workflow.includes("\n  deploy-content:"), "deploy-content job exists")
  const deploy = workflow.slice(workflow.indexOf("\n  deploy:"), workflow.indexOf("\n  deploy-content:"))
  const content = workflow.slice(workflow.indexOf("\n  deploy-content:"))
  assert.match(deploy, /name: production\b/)
  assert.match(deploy, /content_only != 'true'/)
  assert.match(content, /needs: \[check, deploy-staging\]/)
  assert.match(content, /content_only == 'true'/)
  assert.match(content, /github\.event_name == 'push' && github\.ref == 'refs\/heads\/main'/)
  assert.match(content, /group: cica-namecheap-production/)
  assert.match(content, /CICA_DEPLOY_TARGET: production/)
  assert.match(workflow, /node deploy\/classify-change\.mjs/)
})

test("CLI compares with what production serves, so content stacked on unapproved code waits", async t => {
  const { execFileSync } = await import("node:child_process")
  const { mkdtemp, mkdir, writeFile, rm } = await import("node:fs/promises")
  const { tmpdir } = await import("node:os")
  const http = await import("node:http")
  const repo = await mkdtemp(path.join(tmpdir(), "cica-classify-"))
  t.after(() => rm(repo, { recursive: true, force: true }))
  const git = (...args) => execFileSync("git", ["-c", "user.email=t@example.com", "-c", "user.name=t", ...args], { cwd: repo, encoding: "utf8" }).trim()
  git("init", "-q")
  await mkdir(path.join(repo, "content"))
  await writeFile(path.join(repo, "app.ts"), "v1")
  await writeFile(path.join(repo, "content/venues.json"), "{}")
  git("add", "-A"); git("commit", "-qm", "approved")
  const approved = git("rev-parse", "HEAD")
  await writeFile(path.join(repo, "app.ts"), "v2")
  git("commit", "-qam", "code waiting for approval")
  const pendingCode = git("rev-parse", "HEAD")
  await writeFile(path.join(repo, "content/venues.json"), '{"a":1}')
  git("commit", "-qam", "Update content/venues.json (via Pages CMS)")
  const contentEdit = git("rev-parse", "HEAD")

  let live = approved
  const server = http.createServer((_, res) => { res.setHeader("content-type", "application/json"); res.end(JSON.stringify({ commit: live })) })
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve))
  t.after(() => server.close())
  const url = `http://127.0.0.1:${server.address().port}/deployment.json`
  const script = path.join(process.cwd(), "deploy/classify-change.mjs")
  const { execFile } = await import("node:child_process")
  // Async on purpose: a synchronous child would block this process's fake production server.
  const run = (...args) => new Promise(resolve => {
    execFile(process.execPath, [script, ...args], { cwd: repo, encoding: "utf8", timeout: 20_000, env: { ...process.env, GITHUB_OUTPUT: "" } },
      (error, stdout) => resolve({ status: error ? error.code : 0, stdout }))
  })

  // Production still serves the approved commit: the CMS edit sits on unapproved code.
  assert.match((await run(url, contentEdit)).stdout, /waits for approval[\s\S]*app\.ts/)
  assert.equal((await run("--require", url, contentEdit)).status, 1)
  // Once the code change is approved and live, the same CMS edit publishes automatically.
  live = pendingCode
  assert.match((await run(url, contentEdit)).stdout, /deploys automatically/)
  assert.equal((await run("--require", url, contentEdit)).status, 0)
  // An unreachable live record falls back to approval.
  assert.equal((await run("--require", "http://127.0.0.1:1/deployment.json", contentEdit)).status, 1)
})
