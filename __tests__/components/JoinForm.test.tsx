import '@testing-library/jest-dom';
declare const expect: jest.Expect;
import { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import JoinPage from '@/app/join/page';

function fillForm() {
  fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'José 李' } });
  fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'visitor@example.com' } });
}
async function submit() {
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Request updates' })); });
}

describe('Join request form', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ success: true, reference: 'abc123def456' }) });
  });

  it('sends the submit.php field names and confirms with the reference', async () => {
    render(<JoinPage />);
    fillForm();
    await submit();
    expect(await screen.findByRole('heading', { name: "Thanks, we'll be in touch." })).toHaveFocus();
    expect(screen.getByText('This records your interest in CICA news and events. It does not register you for a team or tournament.')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('abc123def456');
    const [url, request] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('/forms/submit.php');
    expect(request.headers).toEqual({ 'Content-Type': 'application/json' });
    const body = JSON.parse(request.body);
    expect(body.type).toBe('updates');
    expect(body.website).toBe('');
    expect(body.phone).toBe('');
    expect(screen.queryByText(/shortly|successfully sent|now on our updates list/i)).not.toBeInTheDocument();
  });

  it('rejects a whitespace-only first field and links the error', async () => {
    render(<JoinPage />);
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
    render(<JoinPage />);
    fillForm();
    await submit();
    expect(await screen.findByRole('alert')).toHaveTextContent('It may already have been saved');
    expect(screen.getByLabelText('Full name')).toHaveValue('José 李');
    expect(screen.getByRole('button', { name: 'Request updates' })).toBeEnabled();
  });

  it('offers privacy information, autofill hints and a native post fallback', () => {
    const { container } = render(<JoinPage />);
    expect(screen.getByRole('link', { name: 'Read our privacy notice.' })).toHaveAttribute('href', '/privacy');
    expect(screen.getByLabelText('Email address')).toHaveAttribute('autocomplete', 'email');
    expect(screen.getByLabelText(/Phone/)).toHaveAttribute('type', 'tel');
    expect(screen.getByLabelText(/Phone/)).toHaveAttribute('inputmode', 'tel');
    expect(container.querySelector('form')).toHaveAttribute('action', '/forms/submit.php');
  });
});
