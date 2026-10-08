import '@testing-library/jest-dom';
declare const expect: jest.Expect;
import { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContactPage from '@/app/contact/page';

function fillForm() {
  fireEvent.change(screen.getByLabelText('First name'), { target: { value: 'José' } });
  fireEvent.change(screen.getByLabelText('Last name'), { target: { value: '李' } });
  fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'visitor@example.com' } });
  fireEvent.change(screen.getByLabelText('Subject'), { target: { value: 'Playing' } });
  fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'How can I join a team?' } });
}
async function submit() {
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Send message' })); });
}

describe('Contact request form', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ success: true, reference: 'abc123def456' }) });
  });

  it('sends the submit.php field names and confirms with the reference', async () => {
    render(<ContactPage />);
    fillForm();
    await submit();
    expect(await screen.findByRole('heading', { name: "Thanks, we'll be in touch." })).toHaveFocus();
    expect(screen.getByText('Thank you for reaching out. For time-sensitive questions, contact the organizers directly.')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('abc123def456');
    const [url, request] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('/forms/submit.php');
    expect(request.headers).toEqual({ 'Content-Type': 'application/json' });
    const body = JSON.parse(request.body);
    expect(body.type).toBe('contact');
    expect(body.website).toBe('');
    expect(body.phone).toBe('');
    expect(screen.queryByText(/shortly|successfully sent|now on our updates list/i)).not.toBeInTheDocument();
  });

  it('prefills the subject from ?topic=update and leaves it blank otherwise', async () => {
    window.history.pushState({}, '', '/contact/?topic=update');
    const { unmount } = render(<ContactPage />);
    await waitFor(() => expect(screen.getByLabelText('Subject')).toHaveValue('Suggest a correction or update'));
    unmount();
    window.history.pushState({}, '', '/contact/?topic=nonsense');
    render(<ContactPage />);
    expect(screen.getByLabelText('Subject')).toHaveValue('');
    window.history.pushState({}, '', '/');
  });

  it('rejects a whitespace-only first field and links the error', async () => {
    render(<ContactPage />);
    fillForm();
    const input = screen.getByLabelText('First name');
    fireEvent.change(input, { target: { value: '   ' } });
    await submit();
    await waitFor(() => expect(input).toHaveAttribute('aria-invalid', 'true'));
    expect(input).toHaveAttribute('aria-describedby', input.id + '-error');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('keeps input after an uncertain failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ success: false }) });
    render(<ContactPage />);
    fillForm();
    await submit();
    expect(await screen.findByRole('alert')).toHaveTextContent('It may already have been saved');
    expect(screen.getByLabelText('First name')).toHaveValue('José');
    expect(screen.getByRole('button', { name: 'Send message' })).toBeEnabled();
  });

  it('offers privacy information, autofill hints and a native post fallback', () => {
    const { container } = render(<ContactPage />);
    expect(screen.getByRole('link', { name: 'Read our privacy notice.' })).toHaveAttribute('href', '/privacy');
    expect(screen.getByLabelText('Email address')).toHaveAttribute('autocomplete', 'email');
    expect(screen.getByLabelText(/Phone/)).toHaveAttribute('type', 'tel');
    expect(screen.getByLabelText(/Phone/)).toHaveAttribute('inputmode', 'tel');
    expect(container.querySelector('form')).toHaveAttribute('action', '/forms/submit.php');
  });
});
