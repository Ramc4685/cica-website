import '@testing-library/jest-dom'
import { render, screen, within } from '@testing-library/react'
declare const expect: jest.Expect
declare const it: jest.It
import { CompetitionCards } from '@/components/sections/competition-cards'
import { MetricsStrip } from '@/components/sections/metrics-strip'
import { PathwayCards } from '@/components/sections/pathway-cards'
import { SponsorTiers, sponsorTierFromInterest, sponsorTierHref } from '@/components/sections/sponsor-tiers'
import { UpcomingSeason } from '@/components/sections/upcoming-season'
import { Voices } from '@/components/sections/voices'
import { WhereWePlay } from '@/components/sections/where-we-play'
import { tournaments } from '@/lib/content'
import { venues } from '@/lib/season'

describe('CompetitionCards', () => {
  it('renders one card per competition and never shows tbc placeholders as facts', () => {
    render(<CompetitionCards variant="page" />)
    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(tournaments.length)
    expect(document.body).not.toHaveTextContent(/tbc/i)
    expect(screen.getAllByText('Registration details from organizers')).toHaveLength(tournaments.length)
    const mains = screen.getByRole('article', { name: 'CICA Mains' })
    expect(mains).toHaveAttribute('id', 'cica-mains')
    expect(within(mains).getByText('BloomBoys')).toBeInTheDocument()
    expect(within(screen.getByRole('article', { name: 'Mini Tournament' })).getByText('Being confirmed with organizers')).toBeInTheDocument()
  })
  it('shows confirmed registration and format facts, with an external register link', () => {
    render(<CompetitionCards tournaments={[{ ...tournaments[0], registrationStatus: 'open', registrationUrl: 'https://example.org/register', registrationDeadline: '2027-03-01', format: { overs: 20, ballType: 'leather', squadSize: 'tbc' } }]} variant="page" />)
    expect(screen.getByText('Registration open until March 1, 2027')).toBeInTheDocument()
    expect(screen.getByText('20 overs')).toBeInTheDocument()
    expect(screen.getByText('Leather ball')).toBeInTheDocument()
    expect(screen.queryByText(/Squads of/)).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Register/ })).toHaveAttribute('href', 'https://example.org/register')
  })
  it('links home cards to tournament anchors', () => {
    render(<CompetitionCards />)
    // next/link drops the trailing slash in tests; the static export restores it via trailingSlash.
    expect(screen.getByRole('link', { name: 'Explore CICA Mains' }).getAttribute('href')).toMatch(/^\/tournaments\/?#cica-mains$/)
  })
})

describe('MetricsStrip', () => {
  it('lists each metric once for assistive tech', () => {
    render(<MetricsStrip metrics={[{ id: 'founded', value: '1998', label: 'Founded' }]} />)
    const items = screen.getAllByRole('listitem', { hidden: true })
    expect(items).toHaveLength(2)
    expect(items[1]).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    expect(items[0]).toHaveTextContent('1998 / Founded')
  })
})

describe('SponsorTiers', () => {
  it('pre-fills the form by tier id, keeps Premium green and shows no prices', () => {
    render(<SponsorTiers />)
    const premium = screen.getByRole('article', { name: 'Premium partner' })
    expect(premium).toHaveAttribute('data-featured', 'true')
    expect(within(premium).getByRole('link', { name: /Ask about this tier/ }).getAttribute('href')).toMatch(/^\/sponsors\/?\?interest=premium#sponsor-form$/)
    expect(document.body).not.toHaveTextContent('$')
    // Unconfirmed benefits are said once in the intro, not repeated as filler on every card.
    expect(screen.getAllByText(/benefits are agreed with the organizers/i)).toHaveLength(1)
    expect(screen.queryByText('What’s included')).toBeNull()
    expect(premium).toHaveAttribute('data-single', 'true')
    expect(sponsorTierHref('cpl-team')).toBe('/sponsors/?interest=cpl-team#sponsor-form')
    expect(sponsorTierFromInterest('matchday')?.name).toBe('Matchday & community supporter')
    expect(sponsorTierFromInterest('unknown')).toBeUndefined()
  })
  it('renders benefit bullets when organizers supply them', () => {
    render(<SponsorTiers tiers={[{ id: 'premium', name: 'Premium partner', summary: 'Lead placement.', benefits: ['Logo on the home page'] }]} />)
    expect(screen.getByText('Logo on the home page')).toBeInTheDocument()
  })
})

describe('PathwayCards', () => {
  it('keeps Play cricket as the featured card', () => {
    render(<PathwayCards />)
    expect(screen.getAllByRole('article')).toHaveLength(4)
    expect(screen.getByRole('article', { name: 'Play cricket' })).toHaveAttribute('data-featured', 'true')
    expect(screen.getByRole('article', { name: 'Lend a hand' })).not.toHaveAttribute('data-featured')
  })
})

describe('season sections', () => {
  it('shows a calm state while no events are published', () => {
    render(<UpcomingSeason />)
    expect(screen.getByText('Season dates are announced by organizers.')).toBeInTheDocument()
  })
  it('sorts events by date and formats them in UTC', () => {
    render(<UpcomingSeason events={[{ id: 'b', title: 'Final', date: '2027-06-01' }, { id: 'a', title: 'Opening day', date: '2027-05-01', venueId: 'baywood' }]} />)
    const titles = screen.getAllByRole('heading', { level: 3 }).map(h => h.textContent)
    expect(titles).toEqual(['Opening day', 'Final'])
    expect(screen.getByText(venues.find(venue => venue.id === 'baywood')!.name)).toBeInTheDocument()
    expect(document.querySelector('time')).toHaveAttribute('dateTime', '2027-05-01')
  })
  it('only renders confirmed venue details', () => {
    render(<WhereWePlay />)
    const unconfirmed = venues.filter(venue => !venue.address).length
    expect(screen.getAllByText('Confirmed by organizers')).toHaveLength(unconfirmed)
    expect(screen.getAllByRole('link', { name: /Ask for directions/ })).toHaveLength(venues.filter(venue => !venue.mapUrl).length)
    expect(screen.getAllByRole('link', { name: /in maps/ })).toHaveLength(venues.filter(venue => venue.mapUrl).length)
  })
  it('renders no voices section without consented quotes', () => {
    const { container } = render(<Voices />)
    expect(container).toBeEmptyDOMElement()
    render(<Voices voices={[{ id: 'v', quote: 'Great season.', name: 'A. Player', role: 'Captain' }]} />)
    expect(screen.getByText('Great season.').closest('blockquote')).toBeInTheDocument()
    expect(screen.getByText('A. Player').closest('figcaption')).toBeInTheDocument()
  })
})
