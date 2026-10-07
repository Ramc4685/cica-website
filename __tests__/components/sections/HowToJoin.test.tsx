import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
declare const expect: jest.Expect
declare const it: jest.It
import { HowToJoin } from '@/components/sections/how-to-join'

describe('HowToJoin', () => {
  it('renders the four steps as a vertical tablist driven by click and keys', () => {
    render(<HowToJoin />)
    const list = screen.getByRole('tablist', { name: 'Steps to join' })
    expect(list).toHaveAttribute('aria-orientation', 'vertical')
    const tabs = screen.getAllByRole('tab')
    expect(tabs.map(tab => tab.textContent)).toEqual(['01Pick a format', '02Talk to an organizer', '03Join a team or register', '04Play the season'])
    fireEvent.click(tabs[2])
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Step 3 of 4')
    fireEvent.keyDown(tabs[2], { key: 'ArrowDown' })
    expect(tabs[3]).toHaveFocus()
    const panel = screen.getByRole('tabpanel')
    expect(panel).toHaveTextContent('Play the season')
    expect(screen.getByRole('link', { name: /Fixtures & scores/ })).toHaveAttribute('target', '_blank')
  })
})
