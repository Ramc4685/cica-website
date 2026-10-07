import '@testing-library/jest-dom'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { MotionControl, MotionProvider } from '@/components/site-motion'

declare const expect: jest.Expect
declare const it: jest.It

describe('Site motion', () => {
  let reducedMotion = false
  let preferenceListener: ((event: MediaQueryListEvent) => void) | undefined

  beforeEach(() => {
    jest.useFakeTimers()
    reducedMotion = false
    preferenceListener = undefined
    window.localStorage.clear()
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

  function renderControl() {
    return render(<MotionProvider><MotionControl /></MotionProvider>)
  }

  it('lets the global control pause and resume site motion and remembers the choice', () => {
    renderControl()
    expect(document.documentElement).toHaveAttribute('data-motion', 'running')

    fireEvent.click(screen.getByRole('button', { name: 'Pause site motion' }))
    expect(document.documentElement).toHaveAttribute('data-motion', 'paused')
    expect(window.localStorage.getItem('cica-motion')).toBe('paused')

    fireEvent.click(screen.getByRole('button', { name: 'Pause site motion' }))
    expect(document.documentElement).toHaveAttribute('data-motion', 'running')
  })

  it('honors the reduced-motion preference and disables the control', () => {
    reducedMotion = true
    renderControl()
    expect(document.documentElement).toHaveAttribute('data-motion', 'paused')
    expect(screen.getByRole('button', { name: 'Motion off (reduced motion preference)' })).toBeDisabled()
  })

  it('pauses when the reduced-motion preference changes', () => {
    renderControl()
    expect(document.documentElement).toHaveAttribute('data-motion', 'running')
    act(() => { preferenceListener?.({ matches: true } as MediaQueryListEvent) })
    expect(document.documentElement).toHaveAttribute('data-motion', 'paused')
    expect(screen.getByRole('button', { name: 'Motion off (reduced motion preference)' })).toBeDisabled()
  })
})
