import '@testing-library/jest-dom';
declare const expect: jest.Expect;
import { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SponsorsPage from '@/app/sponsors/page';
import { MotionProvider } from '@/components/site-motion';

function fillForm() {
  fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'José 李' } });
  fireEvent.change(screen.getByLabelText('Company'), { target: { value: 'Local business' } });
  fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'visitor@example.com' } });
  fireEvent.change(screen.getByLabelText('Sponsorship Interest'), { target: { value: 'Community events' } });
  fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'We would like to support community cricket.' } });
}
async function submit() {
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Submit Sponsorship Inquiry' })); });
}

describe('Sponsor request form', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
  });

  it('accepts Unicode names and an omitted phone, and leaves a persistent honest confirmation', async () => {
    render(<MotionProvider><SponsorsPage /></MotionProvider>);
    fillForm();
    await submit();
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Your sponsorship inquiry has been recorded.'));
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const request = (global.fetch as jest.Mock).mock.calls[0][1];
    expect(request.headers).toEqual({ 'Content-Type': 'application/json' });
    expect(request.mode).not.toBe('no-cors');
    expect(JSON.parse(request.body).phone).toBe('');
    expect(JSON.parse(request.body).website).toBe('');
    expect(JSON.parse(request.body).type).toBe('sponsor');
    expect((global.fetch as jest.Mock).mock.calls[0][0]).toBe('/forms/submit.php');
    expect(screen.getByRole('button', { name: 'Send another request' })).toBeInTheDocument();
    expect(screen.queryByText(/shortly|successfully sent|now on our updates list/i)).not.toBeInTheDocument();
  });

  it('connects validation errors to their fields and rejects a whitespace-only name', async () => {
    render(<MotionProvider><SponsorsPage /></MotionProvider>);
    fillForm();
    const input = screen.getByLabelText('Full Name');
    fireEvent.change(input, { target: { value: '   ' } });
    await submit();
    await waitFor(() => expect(input).toHaveAttribute('aria-invalid', 'true'));
    expect(input).toHaveAttribute('aria-describedby', input.id + '-error');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('shows failure inline, preserves input, and warns against duplicate retries', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => ({ success: false }) });
    render(<MotionProvider><SponsorsPage /></MotionProvider>);
    fillForm();
    await submit();
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('It may already have been saved'));
    expect(screen.getByLabelText('Full Name')).toHaveValue('José 李');
    expect(screen.getByRole('button', { name: 'Submit Sponsorship Inquiry' })).toBeEnabled();
    expect(screen.getAllByRole('link', { name: /Email the organizers/i }).length).toBeGreaterThan(0);
  });

  it('offers privacy information and mobile autofill hints', () => {
    render(<MotionProvider><SponsorsPage /></MotionProvider>);
    expect(screen.getByRole('link', { name: 'Read our privacy notice.' })).toHaveAttribute('href', '/privacy');
    expect(screen.getByLabelText('Email Address')).toHaveAttribute('autocomplete', 'email');
    expect(screen.getByLabelText(/Phone/)).toHaveAttribute('type', 'tel');
    expect(screen.getByLabelText(/Phone/)).toHaveAttribute('inputmode', 'tel');
  });
});
