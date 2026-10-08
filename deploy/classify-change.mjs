// Decides whether a push to main changed only organizer content (Pages CMS edits), which may go to
// production without manual approval. The decision is based on the files changed, never on the commit author
// or message, so any push that touches code, config or the workflow still waits for the owner's approval.
import { execFileSync } from "node:child_process"
import { appendFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const isContentPath = file => {
  const normalized = path.posix.normalize(file)
  return normalized === file && normalized.startsWith("content/") && normalized.length > "content/".length
}

/** True only when history is known (before is a real ancestor) and every changed path is under content/. */
export function isContentOnlyChange({ before, isAncestor, files }) {
  if (!/^[0-9a-f]{40}$/.test(before ?? "") || /^0+$/.test(before)) return false
  if (!isAncestor || files.length === 0) return false
  return files.every(isContentPath)
}

/** The commit production is serving, from the deployment.json that prepare-release.mjs writes into every release. */
export async function liveCommit(url) {
  const response = await fetch(url, { cache: "no-store" })
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`)
  const { commit } = await response.json()
  if (!/^[0-9a-f]{40}$/.test(commit ?? "")) throw new Error(`${url}: no commit recorded`)
  return commit
}

// CLI: node deploy/classify-change.mjs <live-deployment-json-url> <after-sha>; writes content_only=true|false to
// $GITHUB_OUTPUT and exits 0. Compares against what production serves, not the previous push, so content edits
// stacked on an unapproved code change still wait for approval. With --require, exits 1 unless content-only.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  const strict = args[0] === "--require"
  const [url = "", after = "HEAD"] = strict ? args.slice(1) : args
  const git = argv => execFileSync("git", argv, { encoding: "utf8" })
  let before = ""
  let isAncestor = false
  let files = []
  try {
    before = await liveCommit(url)
    console.log(`Production serves ${before}.`)
    git(["merge-base", "--is-ancestor", before, after])
    isAncestor = true
    // --no-renames reports both sides of a move, so moving a file into content/ still needs approval.
    files = git(["diff", "--name-only", "--no-renames", before, after]).split("\n").filter(Boolean)
  } catch (error) {
    // Unreadable live commit, or unknown/unrelated history (rollback, force push): fall back to the approval path.
    console.log(`Could not compare with production: ${error.message.split("\n")[0]}`)
  }
  const contentOnly = isContentOnlyChange({ before, isAncestor, files })
  console.log(contentOnly
    ? `Content-only change since production (${files.length} file${files.length === 1 ? "" : "s"} under content/): production deploys automatically.`
    : `Changes since production include more than content/ (or history is unknown): production waits for approval.${files.length ? `\n  ${files.filter(f => !f.startsWith("content/")).slice(0, 20).join("\n  ")}` : ""}`)
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `content_only=${contentOnly}\n`)
  if (strict && !contentOnly) process.exit(1)
}
