import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import { FooterCta } from '@/components/footer-cta'

declare const expect: jest.Expect
declare const it: jest.It

jest.mock('next/navigation', () => ({ usePathname: jest.fn() }))
const mockPathname = usePathname as jest.Mock

describe('FooterCta', () => {
  it.each(['/join/', '/contact', '/sponsors/'])('points form page %s to tournaments instead of competing with the form', path => {
    mockPathname.mockReturnValue(path)
    render(<FooterCta />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('See you at the ground.')
    expect(screen.getByRole('link', { name: /Explore tournaments/ })).toHaveAttribute('href', expect.stringMatching(/^\/tournaments\/?$/))
  })

  it('never links /get-involved/ to itself', () => {
    mockPathname.mockReturnValue('/get-involved/')
    render(<FooterCta />)
    expect(screen.getByRole('link')).toHaveAttribute('href', expect.stringMatching(/^\/contact\/?$/))
  })

  it('invites everyone else to get involved', () => {
    mockPathname.mockReturnValue('/about/')
    render(<FooterCta />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Ready for the season? Join CICA.')
    expect(screen.getByRole('link', { name: /Get involved/ })).toHaveAttribute('href', expect.stringMatching(/^\/get-involved\/?$/))
  })
})
