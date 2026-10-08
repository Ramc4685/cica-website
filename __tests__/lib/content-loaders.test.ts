declare const expect: jest.Expect
declare const it: jest.It
import { competitions } from '@/lib/champions'
import { voices } from '@/lib/season'
import { communityLinks } from '@/lib/content'
import { cplSponsors, cplTeams } from '@/lib/brand-assets'
import { communityPhotos, heroPhoto, heroPhotos, photoById } from '@/lib/community-photos'

describe('content loaders', () => {
  it('keep champion records', () => {
    expect(competitions.find(c => c.id === 'mains')?.records[0]).toMatchObject({ season: 2024, champion: 'BloomBoys' })
  })
  it('build photos with derivative dimensions and preserve order', () => {
    expect(heroPhoto.id).toBe('outdoor-award')
    expect(communityPhotos[0].id).toBe('outdoor-award')
    expect(heroPhotos.map(p => p.id).slice(0, 3)).toEqual(['outdoor-award', 'outdoor-bat-presentation', 'indoor-trophy-moment'])
    for (const photo of communityPhotos) {
      expect(photo.gallerySrc).toMatch(/^\/_media\//)
      expect(photo.width).toBeGreaterThan(0)
    }
  })
  it('falls back when a referenced photo id was removed by an editor', () => {
    expect(photoById('does-not-exist').id).toBe(communityPhotos[0].id)
  })
  it('load venues, sponsors, teams and site links from content files', () => {
    expect(cplTeams).toHaveLength(8)
    expect(cplTeams[0]).toMatchObject({ id: 'archrivals', logo: '/images/teams/archrivals.webp', small: '/images/logos-sm/teams/archrivals.webp' })
    expect(cplSponsors.map(s => s.id)).toContain('parke-regency')
    expect(communityLinks.email).toBe('mailto:organizers@cicainfo.com')
    expect(voices).toEqual([])
  })
})
