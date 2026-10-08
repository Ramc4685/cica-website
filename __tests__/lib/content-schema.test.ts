declare const expect: jest.Expect
declare const it: jest.It
import champions from '@/content/champions.json'
import photos from '@/content/photos.json'
import tournaments from '@/content/tournaments.json'
import season from '@/content/season.json'
import faq from '@/content/faq.json'
import venues from '@/content/venues.json'
import sponsors from '@/content/sponsors.json'
import teams from '@/content/teams.json'
import board from '@/content/board.json'
import site from '@/content/site.json'
import { boardFileSchema, championsFileSchema, faqFileSchema, parseContent, photosFileSchema, seasonFileSchema, siteFileSchema, sponsorsFileSchema, teamsFileSchema, tournamentsFileSchema, venuesFileSchema } from '@/lib/content-schema'

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value))

describe('content schemas', () => {
  it('accept the migrated content', () => {
    expect(() => parseContent(championsFileSchema, champions, 'champions.json')).not.toThrow()
    expect(() => parseContent(photosFileSchema, photos, 'photos.json')).not.toThrow()
    expect(() => parseContent(tournamentsFileSchema, tournaments, 'tournaments.json')).not.toThrow()
    expect(() => parseContent(seasonFileSchema, season, 'season.json')).not.toThrow()
    expect(() => parseContent(faqFileSchema, faq, 'faq.json')).not.toThrow()
    expect(() => parseContent(venuesFileSchema, venues, 'venues.json')).not.toThrow()
    expect(() => parseContent(sponsorsFileSchema, sponsors, 'sponsors.json')).not.toThrow()
    expect(() => parseContent(teamsFileSchema, teams, 'teams.json')).not.toThrow()
    expect(() => parseContent(boardFileSchema, board, 'board.json')).not.toThrow()
    expect(() => parseContent(siteFileSchema, site, 'site.json')).not.toThrow()
  })
  it('rejects unknown keys', () => {
    const bad = clone(champions) as any
    bad.competitions[0].records[0].mvp = 'x'
    expect(() => parseContent(championsFileSchema, bad, 'champions.json')).toThrow(/content\/champions\.json: competitions\.0\.records\.0/)
  })
  it('requires alt text with a champion photo and keeps photos under /uploads/champions/', () => {
    const bad = clone(champions) as any
    bad.competitions[0].records[0].photo = { src: '/uploads/champions/team.jpg', alt: '' }
    expect(() => parseContent(championsFileSchema, bad, 'champions.json')).toThrow(/alt/)
    bad.competitions[0].records[0].photo = { src: 'https://evil.example/x.jpg', alt: 'Team' }
    expect(() => parseContent(championsFileSchema, bad, 'champions.json')).toThrow(/src/)
  })
  it('rejects non-https links and over-long text', () => {
    const bad = clone(tournaments) as any
    bad.tournaments[0].registrationUrl = 'javascript:alert(1)'
    expect(() => parseContent(tournamentsFileSchema, bad, 'tournaments.json')).toThrow(/registrationUrl/)
    const long = clone(faq) as any
    long.faq[0].answer = 'x'.repeat(5001)
    expect(() => parseContent(faqFileSchema, long, 'faq.json')).toThrow(/answer/)
  })
  it('rejects photos outside the allowed folders and unsafe focal points', () => {
    const bad = clone(photos) as any
    bad.photos[0].src = '/../secret.jpg'
    expect(() => parseContent(photosFileSchema, bad, 'photos.json')).toThrow(/src/)
    const focal = clone(photos) as any
    focal.photos[0].objectPosition = 'center; background:url(x)'
    expect(() => parseContent(photosFileSchema, focal, 'photos.json')).toThrow(/objectPosition/)
  })
})

describe('blank optional fields from the editor', () => {
  it('treat empty strings as not set', () => {
    const data = clone(tournaments) as any
    data.tournaments[0].registrationUrl = ''
    data.tournaments[0].registrationDeadline = ''
    const parsed = parseContent(tournamentsFileSchema, data, 'tournaments.json')
    expect(parsed.tournaments[0].registrationUrl).toBeUndefined()
    const champs = clone(champions) as any
    champs.competitions[0].records[0].runnerUp = ''
    expect(parseContent(championsFileSchema, champs, 'champions.json').competitions[0].records[0].runnerUp).toBeUndefined()
  })
})

describe('format counts typed in the editor', () => {
  it('coerce numeric text to numbers, keep tbc, and reject other text', () => {
    const data = clone(tournaments) as any
    data.tournaments[0].format.overs = '13'
    data.tournaments[0].format.squadSize = ''
    const parsed = parseContent(tournamentsFileSchema, data, 'tournaments.json')
    expect(parsed.tournaments[0].format.overs).toBe(13)
    expect(parsed.tournaments[0].format.squadSize).toBeUndefined()
    expect(parsed.tournaments[1].format.overs).toBe('tbc')
    data.tournaments[0].format.overs = 'lots'
    expect(() => parseContent(tournamentsFileSchema, data, 'tournaments.json')).toThrow(/overs/)
  })
})

// Mirrors Pages CMS sanitizeObject: a save deletes keys whose value is "" or an empty array.
function sanitize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitize)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, sanitize(child)]).filter(([, child]) => child !== '' && !(Array.isArray(child) && child.length === 0)))
  }
  return value
}

describe('content after a Pages CMS save strips blank values and empty lists', () => {
  const files = [['champions.json', championsFileSchema, champions], ['photos.json', photosFileSchema, photos], ['tournaments.json', tournamentsFileSchema, tournaments], ['season.json', seasonFileSchema, season], ['faq.json', faqFileSchema, faq], ['venues.json', venuesFileSchema, venues], ['sponsors.json', sponsorsFileSchema, sponsors], ['teams.json', teamsFileSchema, teams], ['board.json', boardFileSchema, board], ['site.json', siteFileSchema, site]] as const
  it.each(files)('%s still parses to the same app data', (file, schema, data) => {
    const saved = sanitize(clone(data))
    expect(parseContent(schema as never, saved, file)).toEqual(parseContent(schema as never, data, file))
  })
  it('keeps a testimonial hidden unless consent is ticked, and rejects logos from other folders', () => {
    const quote = { id: 'a-quote', quote: 'Great season.', name: 'A Player', consent: false }
    expect(parseContent(seasonFileSchema, { voices: [quote] }, 'season.json').voices[0].consent).toBe(false)
    const bad = clone(teams) as any
    bad.teams[0].logo = '/uploads/photos/x.png'
    expect(() => parseContent(teamsFileSchema, bad, 'teams.json')).toThrow(/logo/)
    bad.teams[0].logo = '/uploads/logos/x.svg'
    expect(() => parseContent(teamsFileSchema, bad, 'teams.json')).toThrow(/logo/)
  })
  it('accepts a competition whose seasons were all removed', () => {
    const data = clone(champions) as any
    data.competitions[0].records = []
    expect(parseContent(championsFileSchema, sanitize(data), 'champions.json').competitions[0].records).toEqual([])
  })

  it('rejects the same season entered twice for one competition', () => {
    const data = clone(champions) as any
    const mains = data.competitions.find((c: any) => c.id === 'mains')
    mains.records.push({ ...mains.records[0], champion: 'Someone else' })
    expect(() => parseContent(championsFileSchema, data, 'champions.json')).toThrow(/CICA Mains has season 2024 more than once/)
  })
})
