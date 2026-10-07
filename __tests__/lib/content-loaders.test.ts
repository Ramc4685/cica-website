declare const expect: jest.Expect
declare const it: jest.It
import { competitions } from '@/lib/champions'
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
})
