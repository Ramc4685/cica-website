import '@testing-library/jest-dom';

// Cypress also declares a global expect; these suites use Jest's matchers.
declare const expect: jest.Expect;
import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContactPage from '@/app/contact/page';

// Mock the sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock fetch for form submission
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true }),
  })
) as jest.Mock;

// Mock AbortSignal.timeout
Object.defineProperty(AbortSignal, "timeout", {
  configurable: true,
  value: jest.fn(() => new AbortController().signal),
});

describe('Contact Form', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the contact form', () => {
    render(<ContactPage />);
    
    expect(screen.getByText(/Send us a Message/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone \(Optional\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Message/i })).toBeInTheDocument();
  });

  it('displays validation errors when form is submitted with empty fields', async () => {
    render(<ContactPage />);
    
    // Submit the form without filling any fields
    const submitButton = screen.getByRole('button', { name: /Send Message/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/First name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/Subject is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Message must be at least 10 characters/i)).toBeInTheDocument();
    });
  });
});
