import '@testing-library/jest-dom';
declare const expect: jest.Expect;
import { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SponsorsPage from '@/app/sponsors/page';
import { MotionProvider } from '@/components/site-motion';

function fillForm() {
  fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'José 李' } });
  fireEvent.change(screen.getByLabelText('Company'), { target: { value: 'Local business' } });
  fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'visitor@example.com' } });
  fireEvent.change(screen.getByLabelText('Sponsorship interest'), { target: { value: 'Premium partner' } });
  fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'We would like to support community cricket.' } });
}
async function submit() {
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Send sponsorship inquiry' })); });
}

describe('Sponsor request form', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ success: true, reference: 'abc123def456' }) });
  });

  it('sends the submit.php field names and confirms with the reference', async () => {
    render(<MotionProvider><SponsorsPage /></MotionProvider>);
    fillForm();
    await submit();
    expect(await screen.findByRole('heading', { name: "Thanks, we'll be in touch." })).toHaveFocus();
    expect(screen.getByText('Thank you for your interest. The organizers can discuss opportunities and confirm the details of a potential partnership.')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('abc123def456');
    const [url, request] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('/forms/submit.php');
    expect(request.headers).toEqual({ 'Content-Type': 'application/json' });
    const body = JSON.parse(request.body);
    expect(body.type).toBe('sponsor');
    expect(body.website).toBe('');
    expect(body.phone).toBe('');
    expect(screen.queryByText(/shortly|successfully sent|now on our updates list/i)).not.toBeInTheDocument();
  });

  it('rejects a whitespace-only first field and links the error', async () => {
    render(<MotionProvider><SponsorsPage /></MotionProvider>);
    fillForm();
    const input = screen.getByLabelText('Full name');
    fireEvent.change(input, { target: { value: '   ' } });
    await submit();
    await waitFor(() => expect(input).toHaveAttribute('aria-invalid', 'true'));
    expect(input).toHaveAttribute('aria-describedby', input.id + '-error');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('keeps input after an uncertain failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ success: false }) });
    render(<MotionProvider><SponsorsPage /></MotionProvider>);
    fillForm();
    await submit();
    expect(await screen.findByRole('alert')).toHaveTextContent('It may already have been saved');
    expect(screen.getByLabelText('Full name')).toHaveValue('José 李');
    expect(screen.getByRole('button', { name: 'Send sponsorship inquiry' })).toBeEnabled();
  });

  it('offers privacy information, autofill hints and a native post fallback', () => {
    const { container } = render(<MotionProvider><SponsorsPage /></MotionProvider>);
    expect(screen.getByRole('link', { name: 'Read our privacy notice.' })).toHaveAttribute('href', '/privacy');
    expect(screen.getByLabelText('Email address')).toHaveAttribute('autocomplete', 'email');
    expect(screen.getByLabelText(/Phone/)).toHaveAttribute('type', 'tel');
    expect(screen.getByLabelText(/Phone/)).toHaveAttribute('inputmode', 'tel');
    expect(container.querySelector('form')).toHaveAttribute('action', '/forms/submit.php');
  });

  it('offers the sponsor tiers as interest options and prefills from ?interest=', () => {
    window.history.replaceState(null, '', '/sponsors/?interest=cpl-team');
    render(<MotionProvider><SponsorsPage /></MotionProvider>);
    const select = screen.getByLabelText('Sponsorship interest');
    expect(select).toHaveValue('CPL team partner');
    expect(Array.from((select as HTMLSelectElement).options).map(option => option.value))
      .toEqual(['', 'Premium partner', 'CPL team partner', 'Matchday & community supporter', 'Not sure yet']);
    window.history.replaceState(null, '', '/');
  });
});
