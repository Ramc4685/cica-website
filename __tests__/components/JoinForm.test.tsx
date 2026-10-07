import '@testing-library/jest-dom';

// Cypress also declares a global expect; these suites use Jest's matchers.
declare const expect: jest.Expect;
import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import JoinPage from '@/app/join/page';
import '@testing-library/jest-dom';
// Explicitly extend Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toBeNull(): R;
      toHaveBeenCalledWith(expected: any): R;
      toHaveBeenCalledTimes(count: number): R;
      toBeCalled(): R;
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


// Mock global fetch for testing
// @ts-ignore - properly typing fetch mock
global.fetch = jest.fn() as jest.Mock<Promise<Response>>;

Object.defineProperty(AbortSignal, "timeout", {
  configurable: true,
  value: jest.fn(() => new AbortController().signal),
});

describe('Join CICA Form', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset fetch mock before each test
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true, message: 'Thank you for joining!' }),
        headers: new Headers(),
        statusText: 'OK',
        redirected: false,
        url: '',
        clone: () => ({}),
        body: null,
        bodyUsed: false,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        blob: () => Promise.resolve(new Blob()),
        formData: () => Promise.resolve(new FormData()),
        text: () => Promise.resolve('')
      } as Response);
    });
  });

  it('renders the join form', () => {
    render(<JoinPage />);
    
    // Check that the page has proper headings
    expect(screen.getByText(/Join CICA For Updates/i)).toBeInTheDocument();
    
    // Check form fields are present
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Subscribe Now/i })).toBeInTheDocument();
  });

  it('displays validation errors when form is submitted with empty fields', async () => {
    render(<JoinPage />);
    
    // Submit the form without filling any fields
    const submitButton = screen.getByRole('button', { name: /Subscribe Now/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/Phone number is required/i)).toBeInTheDocument();
    });
  });

  it('submits the form successfully when all fields are filled', async () => {
    // Use an automatically resolving mock for this test
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true, message: 'Thank you for joining!' })
    } as Response);
    
    // Render the form
    render(<JoinPage />);
    
    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: '123-456-7890' },
    });

    // Click the submit button directly
    const submitButton = screen.getByRole('button', { name: /Subscribe Now/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Thank you for subscribing!')).toBeInTheDocument();
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const request = (global.fetch as jest.Mock).mock.calls[0][1];
    expect(request.method).toBe('POST');
    expect(request.headers).toEqual({ 'Content-Type': 'text/plain;charset=UTF-8' });
    expect(request.mode).not.toBe('no-cors');
    expect(JSON.parse(request.body)).toEqual({ name: 'Test User', email: 'user@example.com', phone: '123-456-7890' });
  });
});
