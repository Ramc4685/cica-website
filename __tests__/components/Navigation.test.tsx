import '@testing-library/jest-dom';

// Cypress also declares a global expect; these suites use Jest's matchers.
declare const expect: jest.Expect;
import React, { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navigation } from '@/components/navigation';
import '@testing-library/jest-dom';

// Add Jest matchers type declarations
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toBeGreaterThan(expected: number): R;
    }
  }
}

// Mock usePathname hook from next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe('Navigation Component', () => {
  it('renders the logo and navigation links', () => {
    render(<Navigation />);
    
    // Check if logo is rendered
    expect(screen.getByAltText(/CICA/i)).toBeInTheDocument();
    
    // Check if main navigation links are present - using getAllByText since links appear in both mobile and desktop views
    expect(screen.getAllByText(/Home/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/About/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Board/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Contact/i).length).toBeGreaterThan(0);
  });

  it('renders the join community button', () => {
    render(<Navigation />);
    
    // Using getAllByRole and checking that at least one exists
    const joinButtons = screen.getAllByRole('link', { name: /Join CICA/i });
    // Check that we found at least one join button
    expect(joinButtons.length).toBeGreaterThan(0);
  });
  it('hides closed mobile links and allows opening, navigating, and closing the menu', () => {
    render(<Navigation />);
    const menu = document.getElementById('mobile-navigation');
    expect(menu).toHaveClass('hidden');
    const toggle = screen.getByRole('button', { name: 'Open navigation menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(menu).not.toHaveClass('hidden');
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const join = menu!.querySelector('a[href="/join"]');
    expect(join).toBeInTheDocument();
    fireEvent.click(join!);
    expect(menu).toHaveClass('hidden');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

});
