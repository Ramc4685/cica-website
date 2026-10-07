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
    ok: true,
    json: () => Promise.resolve({ success: true }),
  })
) as jest.Mock;

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
  it('submits JSON to the same-origin form handler', async () => {
    render(<ContactPage />);
    const fields = [
      [/First Name/i, 'Test'], [/Last Name/i, 'User'], [/Email/i, 'contact@example.com'],
      [/Phone \(Optional\)/i, '123-456-7890'], [/Subject/i, 'Tournament inquiry'],
      [/Message/i, 'Please share information about joining the next tournament.'],
    ] as const;
    for (const [label, value] of fields) {
      fireEvent.change(screen.getByLabelText(label), { target: { value } });
    }
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));
    });
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    const [url, request] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('/forms/submit.php');
    expect(request.method).toBe('POST');
    expect(request.headers).toEqual({ 'Content-Type': 'application/json' });
    expect(JSON.parse(request.body)).toEqual({
      type: 'contact', website: '', firstName: 'Test', lastName: 'User', email: 'contact@example.com', phone: '123-456-7890',
      subject: 'Tournament inquiry', message: 'Please share information about joining the next tournament.',
    });
    expect(screen.getByText(/Your message has been sent successfully/i)).toBeInTheDocument();
  });

  it('warns against resubmitting when the handler cannot confirm the save', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, json: async () => ({ success: false }) });
    render(<ContactPage />);
    const fields = [
      [/First Name/i, 'Test'], [/Last Name/i, 'User'], [/Email/i, 'contact@example.com'],
      [/Subject/i, 'Tournament inquiry'], [/Message/i, 'Please share information about the next tournament.'],
    ] as const;
    for (const [label, value] of fields) {
      fireEvent.change(screen.getByLabelText(label), { target: { value } });
    }
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));
    });
    expect(await screen.findByText(/It may already have been saved/i)).toBeInTheDocument();
    expect(screen.queryByText(/Your message has been sent successfully/i)).not.toBeInTheDocument();
  });
});
