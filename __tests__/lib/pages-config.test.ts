/** @jest-environment node */
declare const expect: jest.Expect
declare const it: jest.It
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { parse } from 'yaml'

const root = path.resolve(__dirname, '../..')
const config = parse(readFileSync(path.join(root, '.pages.yml'), 'utf8'))
const json = (file: string) => JSON.parse(readFileSync(path.join(root, 'content', file), 'utf8'))

interface Field { name: string; type: string; list?: unknown; fields?: Field[]; options?: Record<string, unknown> }

/** Dotted key paths of a JSON value; array items share one `[]` segment. */
function dataPaths(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) return value.flatMap(item => dataPaths(item, prefix))
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) => [prefix ? `${prefix}.${key}` : key, ...dataPaths(child, prefix ? `${prefix}.${key}` : key)])
  }
  return []
}
function declaredPaths(fields: Field[], prefix = ''): string[] {
  return fields.flatMap(field => {
    const here = prefix ? `${prefix}.${field.name}` : field.name
    return [here, ...(field.fields ? declaredPaths(field.fields, here) : [])]
  })
}
const entry = (file: string) => config.content.find((item: { path: string }) => item.path === `content/${file}`)

// Optional keys the zod schemas allow even when no current item uses them.
const optionalKeys: Record<string, string[]> = {
  'champions.json': ['competitions.records.runnerUp', 'competitions.records.notes', 'competitions.records.photo', 'competitions.records.photo.src', 'competitions.records.photo.alt'],
  'tournaments.json': ['tournaments.registrationDeadline', 'tournaments.registrationUrl', 'tournaments.format.rulesPdf'],
  'season.json': ['events.id', 'events.title', 'events.date', 'events.competitionId', 'events.venueId', 'events.summary', 'events.url', 'announcements.id', 'announcements.title', 'announcements.date', 'announcements.body', 'announcements.url'],
  'photos.json': [],
}

describe('.pages.yml', () => {
  it('declares a JSON file entry for each content file', () => {
    for (const file of Object.keys(optionalKeys)) {
      const item = entry(file)
      expect(item).toBeDefined()
      expect(item.type).toBe('file')
      expect(item.format).toBe('json')
    }
  })

  it('declares every key that exists in, or is allowed by the schema for, each content file', () => {
    for (const [file, extra] of Object.entries(optionalKeys)) {
      const declared = new Set(declaredPaths(entry(file).fields))
      const needed = new Set([...dataPaths(json(file)), ...extra])
      const missing = [...needed].filter(key => !declared.has(key))
      expect({ file, missing }).toEqual({ file, missing: [] })
    }
  })

  it('keeps code-owned keys hidden or read-only so volunteers cannot break them', () => {
    const owned: [string, string][] = [['champions.json', 'competitions.id'], ['tournaments.json', 'tournaments.id'], ['tournaments.json', 'tournaments.logo'], ['tournaments.json', 'tournaments.setting']]
    for (const [file, dotted] of owned) {
      const field = fieldAt(entry(file).fields, dotted) as Field & { hidden?: boolean; readonly?: boolean }
      expect({ dotted, locked: Boolean(field.hidden || field.readonly) }).toEqual({ dotted, locked: true })
    }
  })

  it('requires the descriptions and names a screen reader user needs', () => {
    const photoAlt = declaredFieldNamed(entry('champions.json').fields, 'photo').fields!.find((f: Field) => f.name === 'alt') as Field & { required?: boolean }
    expect(photoAlt.required).toBe(true)
    const galleryAlt = entry('photos.json').fields[0].fields.find((f: Field) => f.name === 'alt')
    expect(galleryAlt.required).toBe(true)
  })

  it('maps uploads to the two allowed folders with image extensions only', () => {
    const media = Array.isArray(config.media) ? config.media : [config.media]
    const byInput = Object.fromEntries(media.map((item: { input: string }) => [item.input, item]))
    expect(byInput['content/uploads/champions'].output).toBe('/uploads/champions')
    expect(byInput['content/uploads/photos'].output).toBe('/uploads/photos')
    for (const item of media) {
      expect([...item.extensions].sort()).toEqual(['jpeg', 'jpg', 'png', 'webp'])
    }
    expect(media).toHaveLength(2)
  })

  it('binds each image field to its media entry and never uses user identity for commits', () => {
    const champions = declaredFieldNamed(entry('champions.json').fields, 'photo').fields!.find((f: Field) => f.name === 'src') as Field
    expect(champions.type).toBe('image')
    const mediaNames = Object.fromEntries((config.media as { name: string; input: string }[]).map(item => [item.input, item.name]))
    expect(champions.options?.media).toBe(mediaNames['content/uploads/champions'])
    const photoSrc = entry('photos.json').fields[0].fields.find((f: Field) => f.name === 'src') as Field
    expect(photoSrc.type).toBe('image')
    expect(photoSrc.options?.media).toBe(mediaNames['content/uploads/photos'])
    expect(config.settings?.commit?.identity).not.toBe('user')
  })

  it('preserves unknown keys instead of silently dropping them on save', () => {
    expect(config.settings?.content?.merge).toBe(true)
  })
})

function declaredFieldNamed(fields: Field[], name: string): Field {
  for (const field of fields) {
    if (field.name === name) return field
    const nested = field.fields && declaredFieldNamed(field.fields, name)
    if (nested) return nested
  }
  throw new Error(`No field named ${name}`)
}

function fieldAt(fields: Field[], dotted: string): Field {
  const [head, ...rest] = dotted.split('.')
  const field = fields.find(f => f.name === head)
  if (!field) throw new Error(`No field ${dotted}`)
  return rest.length ? fieldAt(field.fields ?? [], rest.join('.')) : field
}
