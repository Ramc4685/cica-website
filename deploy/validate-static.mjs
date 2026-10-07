import { lstat, readdir, readFile, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export async function validateStatic(directory) {
  const root = path.resolve(directory)
  const files = []
  async function walk(relative = '') {
    for (const name of await readdir(path.join(root, relative))) {
      const file = relative ? `${relative}/${name}` : name
      if (!/^[a-zA-Z0-9_./-]+$/.test(file) || file.split('/').includes('..')) {
        throw new Error(`Unsafe export path: ${file}`)
      }
      if (/^(\.well-known|cgi-bin)(\/|$)/.test(file)) {
        throw new Error(`Export must not own hosting-managed path: ${file}`)
      }
      const stat = await lstat(path.join(root, file))
      if (stat.isSymbolicLink()) throw new Error(`Symlink in export: ${file}`)
      if (stat.isDirectory()) await walk(file)
      else if (stat.isFile()) files.push(file)
      else throw new Error(`Unsupported export entry: ${file}`)
    }
  }
  await walk()
  const expected = ['index.html', '404.html', '.htaccess', 'admin/index.html', 'admin-login/index.html']
  for (const file of expected) {
    if (!files.includes(file)) throw new Error(`Missing required export: ${file}`)
  }
  if (!files.some(file => file.startsWith('_next/static/') && file.endsWith('.js'))) {
    throw new Error('Missing Next.js JavaScript assets')
  }
  for (const file of files.filter(file => file.endsWith('.html'))) {
    const html = await readFile(path.join(root, file), 'utf8')
    if (file === 'admin/index.html' || file === 'admin-login/index.html') {
      if (!html.includes('Administration is unavailable')) {
        throw new Error(`Admin unavailable notice missing: ${file}`)
      }
      if (/<form\b|<input\b[^>]*\btype=["']password["']/i.test(html)) {
        throw new Error(`Public admin authentication form remains: ${file}`)
      }
    }
    for (const match of html.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)) {
      const value = match[1].replaceAll('&amp;', '&')
      if (!value || /^(#|[a-z][a-z0-9+.-]*:|\/\/)/i.test(value)) continue
      const base = `https://cicainfo.com/${file === 'index.html' ? '' : file.replace(/index\.html$/, '')}`
      const pathname = decodeURIComponent(new URL(value, base).pathname)
      const relative = pathname.replace(/^\/+/, '')
      if (relative.split('/').includes('..')) throw new Error(`Unsafe asset URL in ${file}`)
      const candidates = [relative || 'index.html', `${relative.replace(/\/$/, '')}/index.html`]
      let exists = false
      for (const candidate of candidates) {
        try { await access(path.join(root, candidate)); exists = true; break } catch {}
      }
      if (!exists) throw new Error(`Missing local link or asset ${value} in ${file}`)
    }
  }
  return files.sort()
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const files = await validateStatic(process.argv[2] || 'out')
  console.log(`Validated ${files.length} static files and local HTML asset/link references.`)
}
