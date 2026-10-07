import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
declare const expect: jest.Expect
declare const it: jest.It
import { CricketFaq } from '@/components/sections/cricket-faq'
import { faq } from '@/lib/season'

describe('CricketFaq', () => {
  it('swaps the answer card and exposes the controlled region', () => {
    render(<CricketFaq />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(faq.length)
    const answer = screen.getByRole('region', { name: faq[0].question })
    buttons.forEach(button => expect(button).toHaveAttribute('aria-controls', answer.id))
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(buttons[2])
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'false')
    expect(buttons[2]).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('region', { name: faq[2].question })).toHaveTextContent(faq[2].answer)
  })
  it('keeps native details for small screens and ends with a contact capsule', () => {
    const { container } = render(<CricketFaq />)
    expect(container.querySelectorAll('details')).toHaveLength(faq.length)
    screen.getAllByRole('link', { name: /Contact organizers/ }).forEach(link => expect(link.getAttribute('href')).toMatch(/^\/contact\/?$/))
    expect(screen.getAllByText('Still unsure? Ask an organizer.')).toHaveLength(2)
  })
})
