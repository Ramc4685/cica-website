import '@testing-library/jest-dom'
import { render, screen, fireEvent, within } from '@testing-library/react'
declare const expect: jest.Expect
declare const it: jest.It
import { usePathname } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { MotionProvider } from '@/components/site-motion'

jest.mock('next/navigation', () => ({ usePathname: jest.fn(() => '/') }))

describe('Navigation', () => {
  it('provides a named home link and distinct participation and updates destinations', () => {
    render(<MotionProvider><Navigation /></MotionProvider>)
    expect(screen.getByRole('link', { name: 'CICA home' })).toHaveAttribute('href', '/')
    expect(screen.getAllByRole('link', { name: /Get involved/ })[0]).toHaveAttribute('href', '/get-involved')
    expect(screen.getAllByText('Email updates')[0]).toHaveAttribute('href', '/join')
  })
  it('normalizes static trailing slashes for the active-page announcement', () => {
    jest.mocked(usePathname).mockReturnValue('/about/')
    render(<MotionProvider><Navigation /></MotionProvider>)
    expect(screen.getAllByText('Our story')[0].closest('a')).toHaveAttribute('aria-current', 'page')
    jest.mocked(usePathname).mockReturnValue('/')
  })
  it('hides mobile navigation until opened and closes on selection', () => {
    render(<MotionProvider><Navigation /></MotionProvider>)
    const panel = document.getElementById('mobile-navigation')!
    expect(panel).toHaveAttribute('hidden')
    const toggle = screen.getByRole('button', { name: 'Open navigation' })
    fireEvent.click(toggle)
    expect(panel).not.toHaveAttribute('hidden')
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(within(panel).getByRole('link', { name: 'Contact' }))
    expect(panel).toHaveAttribute('hidden')
  })
  it('closes the mobile disclosure on Escape and restores button focus', () => {
    render(<MotionProvider><Navigation /></MotionProvider>)
    const toggle = screen.getByRole('button', { name: 'Open navigation' })
    fireEvent.click(toggle)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveFocus()
  })
})
