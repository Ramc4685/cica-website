import '@testing-library/jest-dom'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { MotionControl, MotionProvider } from '@/components/site-motion'
import { SponsorSpotlight } from '@/components/sponsor-spotlight'
import { cplSponsors } from '@/lib/brand-assets'

declare const expect: jest.Expect
declare const it: jest.It

describe('Site motion', () => {
  let reducedMotion = false
  let preferenceListener: ((event: MediaQueryListEvent) => void) | undefined

  beforeEach(() => {
    jest.useFakeTimers()
    reducedMotion = false
    preferenceListener = undefined
    jest.spyOn(window, 'matchMedia').mockImplementation(query => ({
      matches: reducedMotion,
      media: query,
      onchange: null,
      addEventListener: jest.fn((_event, listener) => {
        preferenceListener = listener as (event: MediaQueryListEvent) => void
      }),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(() => true),
    }))
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  function renderSpotlight() {
    return render(<MotionProvider><MotionControl /><SponsorSpotlight /></MotionProvider>)
  }

  function advanceSponsor() {
    act(() => { jest.advanceTimersByTime(7000) })
  }

  it('cycles sponsors and lets the global control pause and resume them', () => {
    renderSpotlight()
    expect(document.documentElement).toHaveAttribute('data-motion', 'running')
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(cplSponsors[0].name)
    advanceSponsor()
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(cplSponsors[1].name)

    fireEvent.click(screen.getByRole('button', { name: 'Pause site motion' }))
    expect(document.documentElement).toHaveAttribute('data-motion', 'paused')
    act(() => { jest.advanceTimersByTime(21000) })
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(cplSponsors[1].name)

    fireEvent.click(screen.getByRole('button', { name: 'Pause site motion' }))
    expect(document.documentElement).toHaveAttribute('data-motion', 'running')
    advanceSponsor()
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(cplSponsors[2].name)
  })

  it('honors reduced motion while keeping manual sponsor navigation available', () => {
    reducedMotion = true
    renderSpotlight()
    expect(document.documentElement).toHaveAttribute('data-motion', 'paused')
    expect(screen.getByRole('button', { name: 'Motion off (reduced motion preference)' })).toBeDisabled()
    act(() => { jest.advanceTimersByTime(21000) })
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(cplSponsors[0].name)

    fireEvent.click(screen.getByRole('button', { name: 'Next sponsor' }))
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(cplSponsors[1].name)
  })

  it('stops active cycling when the reduced-motion preference changes', () => {
    renderSpotlight()
    advanceSponsor()
    act(() => { preferenceListener?.({ matches: true } as MediaQueryListEvent) })
    expect(document.documentElement).toHaveAttribute('data-motion', 'paused')
    expect(screen.getByRole('button', { name: 'Motion off (reduced motion preference)' })).toBeDisabled()
    act(() => { jest.advanceTimersByTime(21000) })
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(cplSponsors[1].name)
  })

  it('pauses sponsor cycling during pointer and keyboard interaction', () => {
    renderSpotlight()
    const section = screen.getByRole('region', { name: /Our CPL sponsors/ })
    fireEvent.mouseEnter(section)
    advanceSponsor()
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(cplSponsors[0].name)
    fireEvent.mouseLeave(section)
    advanceSponsor()
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(cplSponsors[1].name)

    const next = screen.getByRole('button', { name: 'Next sponsor' })
    fireEvent.focus(next)
    advanceSponsor()
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(cplSponsors[1].name)
    fireEvent.click(next)
    advanceSponsor()
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(cplSponsors[2].name)
    fireEvent.blur(next, { relatedTarget: screen.getByRole('button', { name: 'Pause site motion' }) })
    advanceSponsor()
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(cplSponsors[3].name)
  })
})
