import '@testing-library/jest-dom';

// Cypress also declares a global expect; these suites use Jest's matchers.
declare const expect: jest.Expect;
import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SponsorsPage from '@/app/sponsors/page';
import '@testing-library/jest-dom';

// Add Jest matchers type declarations
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveBeenCalledTimes(expected: number): R;
      toHaveBeenCalledWith(...args: any[]): R;
    }
  }
}

// Define expect extensions
declare global {
  namespace jest {
    interface Expect {
      objectContaining(expected: object): any;
      stringContaining(expected: string): any;
      any(constructor: any): any;
    }
  }
}

// Mock the sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock fetch for form submission with proper Response interface implementation
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    redirected: false,
    type: 'basic' as ResponseType,
    url: '',
    json: () => Promise.resolve({ success: true, message: 'Form submitted successfully' }),
    text: () => Promise.resolve(JSON.stringify({ success: true, message: 'Form submitted successfully' })),
    blob: () => Promise.resolve(new Blob()),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    formData: () => Promise.resolve(new FormData()),
    clone: function() { return this as Response; },
    body: null,
    bodyUsed: false,
  } as Response)
);

describe('Sponsor Form', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the sponsor form', () => {
    render(<SponsorsPage />);
    
    // Check that the page has proper headings
    expect(screen.getByText(/Become a Sponsor/i)).toBeInTheDocument();
    
    // Check form fields are present
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Company/i)).toBeInTheDocument();
    // Updated to match actual label in component
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    // Updated to match actual label in component
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sponsorship Interest/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  it('displays validation errors when form is submitted with empty fields', async () => {
    render(<SponsorsPage />);
    
    // Submit the form without filling any fields
    const submitButton = screen.getByRole('button', { name: /Submit/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/Full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Company name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/Sponsorship interest is required/i)).toBeInTheDocument();
    });
  });

  it('submits the form successfully when all fields are filled', async () => {
    render(<SponsorsPage />);
    
    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: 'Test Sponsor' },
    });
    fireEvent.change(screen.getByLabelText(/Company/i), {
      target: { value: 'Test Company LLC' },
    });
    // Updated to match actual label in component
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'sponsor@example.com' },
    });
    // Updated to match actual label in component
    fireEvent.change(screen.getByLabelText(/Phone/i), {
      target: { value: '123-456-7890' },
    });
    fireEvent.change(screen.getByLabelText(/Sponsorship Interest/i), {
      target: { value: 'Tournament Sponsorship' },
    });
    fireEvent.change(screen.getByLabelText(/Message/i), {
      target: { value: 'This is a test message for the sponsor form.' },
    });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Submit/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Verify form submission API was called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith('/forms/submit.php', expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: expect.any(String),
      }));
    });

    const request = (global.fetch as jest.Mock).mock.calls[0][1];
    expect(JSON.parse(request.body)).toEqual({
      type: 'sponsor', website: '', fullName: 'Test Sponsor', company: 'Test Company LLC', email: 'sponsor@example.com',
      phone: '123-456-7890', interest: 'Tournament Sponsorship',
      message: 'This is a test message for the sponsor form.',
    });

    // Verify success toast was shown
    const { toast } = require('sonner');
    expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Your sponsorship inquiry has been sent!'));
  });
});
