import '@testing-library/jest-dom'
import { fireEvent, render, screen, within } from '@testing-library/react'
declare const expect: jest.Expect
declare const it: jest.It
import { ChampionsShowcase } from '@/components/sections/champions-showcase'
import { buildChampionHighlights, ordinal } from '@/components/sections/competition-meta'
import { nextTabIndex } from '@/components/sections/use-roving-tabs'
import { competitions, type Competition } from '@/lib/champions'

jest.mock('@/lib/media', () => ({
  mediaFor: () => ({ width: 1200, height: 800, full: { src: '/_media/x-1600.webp', width: 1200, height: 800 }, gallery: { src: '/_media/x-640.webp', width: 640, height: 427 } }),
}))

const byId = (id: string) => competitions.find(c => c.id === id)!

describe('nextTabIndex', () => {
  it('wraps arrows and jumps with Home/End', () => {
    expect(nextTabIndex('ArrowRight', 2, 3)).toBe(0)
    expect(nextTabIndex('ArrowLeft', 0, 3)).toBe(2)
    expect(nextTabIndex('ArrowDown', 0, 3)).toBe(1)
    expect(nextTabIndex('ArrowUp', 1, 3)).toBe(0)
    expect(nextTabIndex('Home', 2, 3)).toBe(0)
    expect(nextTabIndex('End', 0, 3)).toBe(2)
    expect(nextTabIndex('Enter', 0, 3)).toBeNull()
    expect(nextTabIndex('ArrowRight', 0, 0)).toBeNull()
  })
})

describe('buildChampionHighlights', () => {
  it('derives pills only from recorded seasons', () => {
    // Mains: BloomBoys won 2024 and 2017; Moghals lead outright with three titles.
    expect(buildChampionHighlights(byId('mains')).pills).toEqual([
      '2024 champion', '2nd CICA Mains title', 'Most titles: Moghals ×3', '12 seasons recorded',
    ])
    expect(buildChampionHighlights(byId('cpl-outdoor')).pills).toEqual([
      '2024 champion', 'Runner-up: Bloom Events Eagles', '1 season recorded',
    ])
  })
  it('skips a leader on a tie and returns nothing for empty competitions', () => {
    const tied: Competition = { id: 'mini', title: 'Mini', records: [{ season: 2024, champion: 'A' }, { season: 2023, champion: 'B' }, { season: 2022, champion: 'C' }, { season: 2021, champion: 'B' }, { season: 2020, champion: 'C' }] }
    expect(buildChampionHighlights(tied).pills).toEqual(['2024 champion', '5 seasons recorded'])
    expect(buildChampionHighlights(byId('mini'))).toEqual({ latest: null, pills: [] })
  })
  it('formats ordinals', () => {
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 112].map(ordinal)).toEqual(['1st', '2nd', '3rd', '4th', '11th', '12th', '13th', '21st', '22nd', '112th'])
  })
})

describe('ChampionsShowcase', () => {
  it('moves selection and focus with arrow keys, Home and End', () => {
    render(<ChampionsShowcase />)
    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(competitions.length)
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
    expect(tabs[1]).toHaveAttribute('tabindex', '-1')
    fireEvent.keyDown(tabs[0], { key: 'ArrowRight' })
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true')
    expect(tabs[1]).toHaveFocus()
    fireEvent.keyDown(tabs[1], { key: 'End' })
    expect(tabs[tabs.length - 1]).toHaveFocus()
    fireEvent.keyDown(tabs[tabs.length - 1], { key: 'ArrowRight' })
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
    const panel = screen.getByRole('tabpanel')
    expect(panel).toHaveAttribute('aria-labelledby', tabs[0].id)
    expect(tabs[0]).toHaveAttribute('aria-controls', panel.id)
  })

  it('shows the archive table, hides an unrecorded runner-up column and flags empty seasons honestly', () => {
    render(<ChampionsShowcase />)
    const mains = screen.getByRole('tabpanel')
    const table = within(mains).getByRole('table')
    expect(within(table).queryByRole('columnheader', { name: 'Runner-up' })).not.toBeInTheDocument()
    expect(within(table).getAllByRole('row')).toHaveLength(byId('mains').records.length + 1)
    fireEvent.click(screen.getByRole('tab', { name: 'CICA Indoor' }))
    expect(within(screen.getByRole('tabpanel')).getByRole('columnheader', { name: 'Runner-up' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('tab', { name: 'Mini Tournament' }))
    const mini = screen.getByRole('tabpanel')
    expect(within(mini).getByText('Results being confirmed with organizers')).toBeInTheDocument()
    expect(within(mini).queryByRole('table')).not.toBeInTheDocument()
  })

  it('compact variant lists only recorded competitions and links to the archive', () => {
    render(<ChampionsShowcase variant="compact" headingId="recent" />)
    expect(screen.getAllByRole('tab').map(tab => tab.textContent)).toEqual(['CICA Mains', 'CICA Indoor', 'CPL Indoor', 'CPL Outdoor'])
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /See every champion/ }).getAttribute('href')).toMatch(/^\/champions\/?$/)
    expect(screen.getByRole('region', { name: /trophy/ })).toBeInTheDocument()
  })
})

describe('ChampionsShowcase photos', () => {
  it('shows a champion photo with its alt text only when a record has one', () => {
    const withPhoto = competitions.map(c => c.id === 'mains'
      ? { ...c, records: [{ ...c.records[0], photo: { src: '/uploads/champions/team.jpg', alt: 'Test alt text' } }, ...c.records.slice(1)] } : c)
    render(<ChampionsShowcase competitions={withPhoto} />)
    expect(screen.getByRole('img', { name: 'Test alt text' })).toBeInTheDocument()
    expect(screen.getByText(/2024 champions: BloomBoys/)).toBeInTheDocument()
  })
  it('renders no champion photos when no record has one', () => {
    const { container } = render(<ChampionsShowcase />)
    expect(container.querySelectorAll('[data-champion-photo]')).toHaveLength(0)
  })
  it('does not render photos in the compact variant', () => {
    const withPhoto = competitions.map(c => c.id === 'mains'
      ? { ...c, records: [{ ...c.records[0], photo: { src: '/uploads/champions/team.jpg', alt: 'Test alt text' } }, ...c.records.slice(1)] } : c)
    const { container } = render(<ChampionsShowcase competitions={withPhoto} variant="compact" />)
    expect(container.querySelectorAll('[data-champion-photo]')).toHaveLength(0)
  })
})
