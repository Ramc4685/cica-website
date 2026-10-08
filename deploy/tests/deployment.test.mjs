import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, writeFile, symlink, access, stat, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'
import { validateStatic } from '../validate-static.mjs'

async function fixture(t) {
  const directory = await mkdtemp(path.join(tmpdir(), 'cica-deploy-test-'))
  t.after(() => rm(directory, { recursive: true, force: true }))
  return directory
}

test('static validator rejects missing assets, links, protected directories, and symlinks', async t => {
  const root = await fixture(t)
  for (const directory of ['_next/static', 'admin', 'admin-login']) await mkdir(path.join(root, directory), { recursive: true })
  for (const file of ['index.html', '404.html', '.htaccess', '_next/static/app.js', 'admin/index.html', 'admin-login/index.html']) {
    await writeFile(path.join(root, file), file.includes('admin') ? 'Organizer tools' : '')
  }
  await validateStatic(root)
  await writeFile(path.join(root, 'index.html'), '<img src="/missing.png">')
  await assert.rejects(validateStatic(root), /Missing local link or asset/)
  await writeFile(path.join(root, 'index.html'), '<a href="/missing/">Missing</a>')
  await assert.rejects(validateStatic(root), /Missing local link or asset/)
  await writeFile(path.join(root, 'index.html'), '')
  await mkdir(path.join(root, '.well-known'))
  await assert.rejects(validateStatic(root), /hosting-managed/)
  await rm(path.join(root, '.well-known'), { recursive: true })
  await symlink('/etc/passwd', path.join(root, 'unsafe.txt'))
  await assert.rejects(validateStatic(root), /Symlink/)
})

test('installer removes old browser bundles, preserves hosting files, and normalizes all public permissions', async t => {
  const account = await fixture(t)
  const release = `${'a'.repeat(40)}-1-1`
  const target = path.join(account, 'public_html')
  const stage = path.join(account, '.cica-deploy', `production-${release}`, 'site')
  for (const directory of ['_next/static', 'admin', '.well-known/pki-validation', 'cgi-bin', 'unrelated']) {
    await mkdir(path.join(target, directory), { recursive: true })
  }
  for (const file of ['index.html', '_next/static/old.js', 'admin/index.html', 'admin.html', '.well-known/pki-validation/token.txt', 'cgi-bin/tool', 'unrelated/file.txt']) {
    await writeFile(path.join(target, file), 'old')
  }
  await mkdir(path.join(stage, '_next/static'), { recursive: true, mode: 0o700 })
  await mkdir(path.join(stage, 'about'), { mode: 0o700 })
  const managed = ['index.html', 'about/index.html', '_next/static/new.js', 'deployment.json']
  for (const file of managed) await writeFile(path.join(stage, file), 'new', { mode: 0o600 })
  await writeFile(path.join(stage, '.cica-manifest'), `${managed.join('\n')}\n`)
  const source = await readFile(new URL('../install-release.sh', import.meta.url), 'utf8')
  const script = path.join(account, 'install-test.sh')
  // Test a copied script in a fixture; the shipped script never accepts a root override.
  await writeFile(script, source.replace('account=/home/cicanrkn', `account=${JSON.stringify(account)}`))
  const result = spawnSync('bash', [script, release, 'production'], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  for (const file of ['_next/static/old.js', 'admin/index.html', 'admin.html', '.cica-manifest']) {
    await assert.rejects(access(path.join(target, file)))
  }
  for (const file of ['.well-known/pki-validation/token.txt', 'cgi-bin/tool', 'unrelated/file.txt']) {
    assert.equal(await readFile(path.join(target, file), 'utf8'), 'old')
  }
  for (const file of managed) assert.equal((await stat(path.join(target, file))).mode & 0o777, 0o644)
  assert.equal((await stat(path.join(target, 'about'))).mode & 0o777, 0o755)
  await access(path.join(account, '.cica-backups', release, 'public_html.tar.gz'))
  assert.equal(await readFile(path.join(account, '.cica-deploy-manifest'), 'utf8'), `${managed.join('\n')}\n`)

  // Simulate an interrupted second release after cp has started changing files.
  const nextRelease = `${'c'.repeat(40)}-3-1`
  const nextStage = path.join(account, '.cica-deploy', `production-${nextRelease}`, 'site')
  await mkdir(path.join(nextStage, '_next/static'), { recursive: true })
  for (const file of ['index.html', 'deployment.json', 'new-page.html', '_next/static/broken.js']) {
    await writeFile(path.join(nextStage, file), 'failed-release')
  }
  await writeFile(path.join(nextStage, '.cica-manifest'), 'index.html\ndeployment.json\nnew-page.html\n_next/static/broken.js\n')
  const bin = path.join(account, 'bin')
  await mkdir(bin)
  await writeFile(path.join(bin, 'cp'), '#!/usr/bin/env bash\nif [[ "$1" == "-R" ]]; then /bin/cp "$@"; exit 1; fi\nexec /bin/cp "$@"\n', { mode: 0o755 })
  const failure = spawnSync('bash', [script, nextRelease, 'production'], {
    encoding: 'utf8', env: { ...process.env, PATH: `${bin}:${process.env.PATH}` },
  })
  assert.notEqual(failure.status, 0)
  assert.match(failure.stderr, /previous website and manifest restored/)
  assert.equal(await readFile(path.join(target, 'index.html'), 'utf8'), 'new')
  assert.equal(await readFile(path.join(target, '_next/static/new.js'), 'utf8'), 'new')
  assert.equal(await readFile(path.join(target, 'about/index.html'), 'utf8'), 'new')
  await assert.rejects(access(path.join(target, 'new-page.html')))
  await assert.rejects(access(path.join(target, '_next/static/broken.js')))
  assert.equal(await readFile(path.join(account, '.cica-deploy-manifest'), 'utf8'), `${managed.join('\n')}\n`)
  for (const file of ['.well-known/pki-validation/token.txt', 'cgi-bin/tool', 'unrelated/file.txt']) {
    assert.equal(await readFile(path.join(target, file), 'utf8'), 'old')
  }
})

test('installer refuses an unsafe previous manifest before touching the live site', async t => {
  const account = await fixture(t)
  const release = `${'b'.repeat(40)}-2-1`
  const target = path.join(account, 'public_html')
  const stage = path.join(account, '.cica-deploy', `production-${release}`, 'site')
  await mkdir(target)
  await mkdir(stage, { recursive: true })
  await writeFile(path.join(target, 'index.html'), 'old')
  for (const file of ['index.html', 'deployment.json']) await writeFile(path.join(stage, file), 'new')
  await writeFile(path.join(stage, '.cica-manifest'), 'index.html\ndeployment.json\n')
  await writeFile(path.join(account, '.cica-deploy-manifest'), '.well-known/pki-validation/token.txt\n')
  const source = await readFile(new URL('../install-release.sh', import.meta.url), 'utf8')
  const script = path.join(account, 'install-test.sh')
  await writeFile(script, source.replace('account=/home/cicanrkn', `account=${JSON.stringify(account)}`))
  const result = spawnSync('bash', [script, release, 'production'], { encoding: 'utf8' })
  assert.notEqual(result.status, 0)
  assert.equal(await readFile(path.join(target, 'index.html'), 'utf8'), 'old')
})

test('installer merges an existing cPanel PHP handler block into the new .htaccess', async t => {
  const account = await fixture(t)
  const release = `${'d'.repeat(40)}-4-1`
  const target = path.join(account, 'public_html')
  const stage = path.join(account, '.cica-deploy', `production-${release}`, 'site')
  await mkdir(target)
  await mkdir(stage, { recursive: true })
  const cpanel = '# php -- BEGIN cPanel-generated handler, do not edit\n<IfModule mime_module>\n  AddHandler application/x-httpd-ea-php82___lsphp .php .php8 .phtml\n</IfModule>\n# php -- END cPanel-generated handler, do not edit\n'
  await writeFile(path.join(target, '.htaccess'), `${cpanel}Options +Indexes\n`)
  const managed = ['index.html', '.htaccess', 'deployment.json']
  await writeFile(path.join(stage, 'index.html'), 'new')
  await writeFile(path.join(stage, 'deployment.json'), 'new')
  await writeFile(path.join(stage, '.htaccess'), 'Options -Indexes\n')
  await writeFile(path.join(stage, '.cica-manifest'), `${managed.join('\n')}\n`)
  const source = await readFile(new URL('../install-release.sh', import.meta.url), 'utf8')
  const script = path.join(account, 'install-test.sh')
  await writeFile(script, source.replace('account=/home/cicanrkn', `account=${JSON.stringify(account)}`))
  const result = spawnSync('bash', [script, release, 'production'], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  const merged = await readFile(path.join(target, '.htaccess'), 'utf8')
  assert.match(merged, /^Options -Indexes$/m)
  assert.doesNotMatch(merged, /Options \+Indexes/)
  assert.ok(merged.includes(cpanel), 'cPanel block preserved verbatim')
  assert.equal(merged.split('BEGIN cPanel-generated handler').length - 1, 1)
})

test('namecheap.htaccess canonicalizes the host, sets HSTS, caching and compression', async () => {
  const rules = await readFile(new URL('../namecheap.htaccess', import.meta.url), 'utf8')
  for (const expected of [
    /RewriteRule \^ https:\/\/cicainfo\.com%\{REQUEST_URI\} \[L,R=301\]/,
    /!\^\/\\\.well-known\//,
    /Strict-Transport-Security/,
    /max-age=31536000, immutable" env=CICA_IMMUTABLE/,
    /max-age=2592000/,
    /no-cache/,
    /DEFLATE text\/html/,
    /ErrorDocument 404 \/404\.html/,
    /X-Frame-Options/,
  ]) assert.match(rules, expected)
})

test('deploy smoke test asserts the PHP forms handler answers GET with a JSON 405', async () => {
  const script = await readFile(new URL('../deploy-namecheap.sh', import.meta.url), 'utf8')
  assert.match(script, /forms\/submit\.php/)
  assert.match(script, /405 application\/json/)
})

test('installer deploys staging to its own root, manifest and backups, marked noindex', async t => {
  const account = await fixture(t)
  const release = `${'d'.repeat(40)}-4-1`
  const production = path.join(account, 'public_html')
  const target = path.join(account, 'staging_html')
  const stage = path.join(account, '.cica-deploy', `staging-${release}`, 'site')
  await mkdir(production)
  await mkdir(target)
  await mkdir(stage, { recursive: true })
  await writeFile(path.join(production, 'index.html'), 'live')
  await writeFile(path.join(account, '.cica-deploy-manifest'), 'index.html\n')
  const managed = ['index.html', 'deployment.json', '.htaccess']
  for (const file of managed) await writeFile(path.join(stage, file), file === '.htaccess' ? 'Options -Indexes\n' : 'staged')
  await writeFile(path.join(stage, '.cica-manifest'), `${managed.join('\n')}\n`)
  const source = await readFile(new URL('../install-release.sh', import.meta.url), 'utf8')
  const script = path.join(account, 'install-test.sh')
  await writeFile(script, source.replace('account=/home/cicanrkn', `account=${JSON.stringify(account)}`))
  const result = spawnSync('bash', [script, release, 'staging'], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  assert.equal(await readFile(path.join(target, 'index.html'), 'utf8'), 'staged')
  assert.match(await readFile(path.join(target, '.htaccess'), 'utf8'), /X-Robots-Tag "noindex, nofollow"/)
  assert.equal(await readFile(path.join(production, 'index.html'), 'utf8'), 'live')
  assert.equal(await readFile(path.join(account, '.cica-deploy-manifest'), 'utf8'), 'index.html\n')
  assert.equal(await readFile(path.join(account, '.cica-staging-manifest'), 'utf8'), `${managed.join('\n')}\n`)
  await access(path.join(account, '.cica-backups', `staging-${release}`, 'public_html.tar.gz'))
  await assert.rejects(access(path.join(account, '.cica-deploy', `staging-${release}`)))
})

test('installer rejects any target other than production or staging', async t => {
  const account = await fixture(t)
  const source = await readFile(new URL('../install-release.sh', import.meta.url), 'utf8')
  const script = path.join(account, 'install-test.sh')
  await writeFile(script, source.replace('account=/home/cicanrkn', `account=${JSON.stringify(account)}`))
  for (const target of ['', 'public_html', '../production', 'Production']) {
    const result = spawnSync('bash', [script, `${'e'.repeat(40)}-5-1`, target], { encoding: 'utf8' })
    assert.notEqual(result.status, 0)
    assert.match(result.stderr, /production or staging/)
  }
})
