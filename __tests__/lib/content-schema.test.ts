declare const expect: jest.Expect
declare const it: jest.It
import champions from '@/content/champions.json'
import photos from '@/content/photos.json'
import tournaments from '@/content/tournaments.json'
import season from '@/content/season.json'
import { championsFileSchema, parseContent, photosFileSchema, seasonFileSchema, tournamentsFileSchema } from '@/lib/content-schema'

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value))

describe('content schemas', () => {
  it('accept the migrated content', () => {
    expect(() => parseContent(championsFileSchema, champions, 'champions.json')).not.toThrow()
    expect(() => parseContent(photosFileSchema, photos, 'photos.json')).not.toThrow()
    expect(() => parseContent(tournamentsFileSchema, tournaments, 'tournaments.json')).not.toThrow()
    expect(() => parseContent(seasonFileSchema, season, 'season.json')).not.toThrow()
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
    const long = clone(season) as any
    long.faq[0].answer = 'x'.repeat(5001)
    expect(() => parseContent(seasonFileSchema, long, 'season.json')).toThrow(/answer/)
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
