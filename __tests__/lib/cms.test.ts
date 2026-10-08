/** @jest-environment node */
declare const expect: jest.Expect
declare const it: jest.It
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { parse } from 'yaml'
import { CMS_SECTIONS, cmsSectionUrl } from '../../lib/cms'

const config = parse(readFileSync(path.resolve(__dirname, '../../.pages.yml'), 'utf8'))

describe('lib/cms', () => {
  it('lists exactly the content and media names declared in .pages.yml', () => {
    const declared = [
      ...config.content.map((item: { name: string }) => `content/${item.name}`),
      ...config.media.map((item: { name: string }) => `media/${item.name}`),
    ].sort()
    expect(CMS_SECTIONS.map(item => `${item.kind}/${item.name}`).sort()).toEqual(declared)
  })

  it('builds deep links under the repository root on main', () => {
    expect(cmsSectionUrl('champions')).toBe('https://app.pagescms.org/Ramc4685/cica-website/main/content/champions')
    expect(cmsSectionUrl('champion-photos')).toBe('https://app.pagescms.org/Ramc4685/cica-website/main/media/champion-photos')
  })
})
