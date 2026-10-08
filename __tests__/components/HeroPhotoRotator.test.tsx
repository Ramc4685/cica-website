import '@testing-library/jest-dom'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { HeroPhotoRotator } from '@/components/hero-photo-rotator'
import { MotionControl, MotionProvider } from '@/components/site-motion'
import { heroPhotos } from '@/lib/community-photos'
import photosFile from '@/content/photos.json'
import type { ImgHTMLAttributes } from 'react'

// Make image readiness deterministic without Next Image's asynchronous decode handling.
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => <img alt={props.alt} src={props.src} onLoad={props.onLoad} aria-hidden={props['aria-hidden']} />,
}))

declare const expect: jest.Expect
declare const it: jest.It

describe('Hero community photos', () => {
  let reducedMotion = false
  let loadedPhotos: Set<number>

  beforeEach(() => {
    jest.useFakeTimers()
    reducedMotion = false
    loadedPhotos = new Set()
    jest.spyOn(window, 'matchMedia').mockImplementation(query => ({
      matches: reducedMotion,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
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

  function renderPhotos() {
    render(<MotionProvider><MotionControl /><HeroPhotoRotator /></MotionProvider>)
  }

  function advancePhoto() {
    act(() => { jest.advanceTimersByTime(6000) })
  }

  function expectPhoto(index: number) {
    if (!loadedPhotos.has(index)) {
      fireEvent.load(screen.getByAltText(heroPhotos[index].alt))
      loadedPhotos.add(index)
    }
    expect(screen.getByText(`Photo ${index + 1} of ${heroPhotos.length}`)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: heroPhotos[index].alt })).toBeInTheDocument()
  }

  it('keeps the current photo visible until the next image loads and reuses loaded images', () => {
    renderPhotos()
    expectPhoto(0)
    expect(screen.queryByAltText(heroPhotos[1].alt)).not.toBeInTheDocument()
    expect(screen.queryByAltText(heroPhotos[2].alt)).not.toBeInTheDocument()
    advancePhoto()
    expect(screen.getByRole('img', { name: heroPhotos[0].alt })).toBeInTheDocument()
    expect(screen.queryByRole('img', { name: heroPhotos[1].alt })).not.toBeInTheDocument()
    expectPhoto(1)
    fireEvent.click(screen.getByRole('button', { name: 'Previous hero photo' }))
    expectPhoto(0)
  })

  it('rotates through every banner photo, wraps to the first, and pauses with the site motion control', () => {
    expect(heroPhotos.map(p => p.id)).toEqual(photosFile.photos.filter(p => p.hero).map(p => p.id))
    renderPhotos()
    expectPhoto(0)
    advancePhoto()
    expectPhoto(1)
    fireEvent.click(screen.getByRole('button', { name: 'Pause site motion' }))
    act(() => { jest.advanceTimersByTime(18000) })
    expectPhoto(1)
    fireEvent.click(screen.getByRole('button', { name: 'Pause site motion' }))
    for (let index = 2; index < heroPhotos.length; index++) {
      advancePhoto()
      expectPhoto(index)
    }
    advancePhoto()
    expectPhoto(0)
  })

  it('leaves reduced-motion photos still and supports manual navigation in both directions', () => {
    reducedMotion = true
    renderPhotos()
    act(() => { jest.advanceTimersByTime(18000) })
    expectPhoto(0)
    fireEvent.click(screen.getByRole('button', { name: 'Previous hero photo' }))
    expectPhoto(heroPhotos.length - 1)
    fireEvent.click(screen.getByRole('button', { name: 'Next hero photo' }))
    expectPhoto(0)
    fireEvent.click(screen.getByRole('button', { name: 'Next hero photo' }))
    expectPhoto(1)
    act(() => { jest.advanceTimersByTime(18000) })
    expectPhoto(1)
  })

  it('pauses automatic changes during pointer and keyboard interaction', () => {
    renderPhotos()
    const photos = screen.getByRole('region', { name: 'CICA community photos' })
    fireEvent.mouseEnter(photos)
    advancePhoto()
    expectPhoto(0)
    fireEvent.mouseLeave(photos)
    advancePhoto()
    expectPhoto(1)

    const next = screen.getByRole('button', { name: 'Next hero photo' })
    fireEvent.focus(next)
    advancePhoto()
    expectPhoto(1)
    fireEvent.click(next)
    advancePhoto()
    expectPhoto(2)
    fireEvent.blur(next, { relatedTarget: screen.getByRole('button', { name: 'Pause site motion' }) })
    advancePhoto()
    expectPhoto(3)
  })

  it('announces only user-initiated photo changes', () => {
    renderPhotos()
    const status = screen.getByText((_, element) => element?.getAttribute('aria-live') === 'polite')
    expectPhoto(0)
    advancePhoto()
    expectPhoto(1)
    expect(status).toBeEmptyDOMElement()
    fireEvent.click(screen.getByRole('button', { name: 'Next hero photo' }))
    expect(status).toHaveTextContent(`Photo 3 of ${heroPhotos.length}: ${heroPhotos[2].alt}`)
  })
})
