import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { validateStatic } from './validate-static.mjs'

const directory = process.argv[2] || 'out'
const commit = process.argv[3]
if (!/^[a-f0-9]{40}$/.test(commit || '')) throw new Error('Expected a complete Git commit SHA')
await writeFile(path.join(directory, 'deployment.json'), `${JSON.stringify({ commit })}\n`)
const files = await validateStatic(directory)
// This manifest travels with the artifact, then is kept outside public_html on the host.
await writeFile(path.join(directory, '.cica-manifest'), `${files.filter(file => file !== '.cica-manifest').join('\n')}\n`)
console.log(`Prepared verified static release ${commit} (${files.length} files).`)
