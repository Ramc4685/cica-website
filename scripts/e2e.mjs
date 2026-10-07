// Serves the static export (pnpm build:namecheap) with a mock /forms/submit.php, then runs Cypress.
// The real handler needs the cPanel account paths; its logic is covered by tests/forms-backend.php.
// Usage: node scripts/e2e.mjs [--serve-only] [cypress run args]
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import path from 'node:path'

const root = path.resolve(process.env.CICA_E2E_ROOT ?? 'out')
const port = Number(process.env.CICA_E2E_PORT ?? 3000)
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.txt': 'text/plain', '.woff2': 'font/woff2' }

async function resolveFile(urlPath) {
  const clean = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '')
  for (const candidate of [clean, path.join(clean, 'index.html'), `${clean}.html`]) {
    const file = path.join(root, candidate)
    if (!file.startsWith(root)) continue
    const info = await stat(file).catch(() => null)
    if (info?.isFile()) return file
  }
  return null
}

const server = createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? '/', `http://localhost:${port}`)
  if (pathname === '/forms/submit.php') {
    if (req.method !== 'POST') {
      res.writeHead(405, { Allow: 'POST', 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ success: false, message: 'Use the CICA website form to submit a request.' }))
    }
    req.resume()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ success: true, reference: 'a'.repeat(24) }))
  }
  const file = await resolveFile(pathname)
  if (!file) {
    res.writeHead(404, { 'Content-Type': 'text/html' })
    return res.end(await readFile(path.join(root, '404.html')).catch(() => 'Not found'))
  }
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream' })
  res.end(await readFile(file))
})

await new Promise(resolve => server.listen(port, '127.0.0.1', resolve))
console.log(`Serving ${root} at http://127.0.0.1:${port}`)
const args = process.argv.slice(2)
if (args[0] === '--serve-only') {
  process.on('SIGINT', () => server.close())
} else {
  const cypress = spawn('pnpm', ['exec', 'cypress', 'run', ...args], { stdio: 'inherit', env: { ...process.env, CYPRESS_BASE_URL: `http://127.0.0.1:${port}` } })
  cypress.on('exit', code => { server.close(); process.exit(code ?? 1) })
}
