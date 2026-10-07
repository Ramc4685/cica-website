import '@testing-library/jest-dom'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { render, screen } from '@testing-library/react'
declare const expect: jest.Expect
declare const it: jest.It
import { LogoFamilyWall } from '@/components/sections/logo-family-wall'
import { cicaIdentities } from '@/lib/brand-assets'

describe('LogoFamilyWall', () => {
  it('shows all seven identities in three treatments, decorative to assistive tech', () => {
    const { container } = render(<LogoFamilyWall />)
    expect(cicaIdentities).toHaveLength(7)
    expect(container.querySelectorAll('[data-tile]')).toHaveLength(21)
    for (const tone of ['blue', 'clear', 'yellow']) expect(container.querySelectorAll(`[data-tile="${tone}"]`)).toHaveLength(7)
    expect(container.querySelector('[data-wall]')).toHaveAttribute('aria-hidden', 'true')
    const caption = screen.getByText(/CICA family of identities/i)
    for (const identity of cicaIdentities) expect(caption).toHaveTextContent(identity.name)
  })

  it('references only images that exist in public/', () => {
    const { container } = render(<LogoFamilyWall />)
    const sources = new Set([...container.querySelectorAll('img')].map(img => img.getAttribute('src')!))
    expect(sources.size).toBe(21)
    for (const src of sources) expect(existsSync(path.join(process.cwd(), 'public', src))).toBe(true)
  })

  it('scopes every animation to running motion and no-preference', () => {
    const css = readFileSync(path.join(process.cwd(), 'components/sections/logo-family-wall.module.css'), 'utf8')
    const [outside, inside = ''] = css.split('@media (prefers-reduced-motion:no-preference)')
    expect(outside).not.toMatch(/animation\s*:/)
    for (const rule of inside.match(/[^{}]+\{[^{}]*animation\s*:[^}]*\}/g) ?? []) expect(rule.trim()).toMatch(/^:global\(html\[data-motion=running\]\)/)
  })
})
