import '@testing-library/jest-dom';
declare const expect: jest.Expect;
import { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CommunityForm, type CommunityField } from '@/components/community-form';

const fields: readonly CommunityField[] = [
  { name: 'name', label: 'Full name', type: 'text', autoComplete: 'name', maxLength: 100, errorLabel: 'Name' },
  { name: 'email', label: 'Email address', type: 'email', autoComplete: 'email', maxLength: 254 },
  { name: 'phone', label: 'Phone (optional)', type: 'tel', autoComplete: 'tel', maxLength: 30 },
  { name: 'interest', label: 'Interest', type: 'select', maxLength: 200, options: [
    { value: 'Premium partner', label: 'Premium partner', slug: 'premium' },
    { value: 'Matchday supporter', label: 'Matchday supporter', slug: 'matchday' },
  ] },
];

const ok = (body: object = { success: true, reference: 'a1b2c3d4e5f6' }) => ({ ok: true, status: 200, json: async () => body });
const rejected = (status: number, body: object, retryAfter?: string) => ({
  ok: false, status, json: async () => body, headers: { get: (name: string) => (name === 'Retry-After' ? retryAfter ?? null : null) },
});

function renderForm(props: Partial<React.ComponentProps<typeof CommunityForm>> = {}) {
  return render(<CommunityForm kind="updates" fields={fields} tag="Let us know" title="Request updates" submitLabel="Send it"
    successCopy={{ body: 'This records your interest.' }} {...props} />);
}
function fill() {
  fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'José 李' } });
  fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'visitor@example.com' } });
  fireEvent.change(screen.getByLabelText('Interest'), { target: { value: 'Premium partner' } });
}
async function submit() {
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Send it' })); });
}

describe('CommunityForm', () => {
  beforeEach(() => { global.fetch = jest.fn().mockResolvedValue(ok()); });
  afterEach(() => { window.history.replaceState(null, '', '/'); });

  it('posts natively without JavaScript and keeps the honeypot', () => {
    const { container } = renderForm();
    const form = container.querySelector('form')!;
    expect(form).toHaveAttribute('method', 'post');
    expect(form).toHaveAttribute('action', '/forms/submit.php');
    expect(form.querySelector('input[type=hidden][name=type]')).toHaveValue('updates');
    expect(form.querySelector('input[name=website]')).toBeInTheDocument();
    expect(screen.getByLabelText('Full name')).toHaveAttribute('name', 'name');
    expect(form).toHaveAttribute('data-hydrated');
  });

  it('keeps one polite status region mounted, then shows the reference and focuses the success heading', async () => {
    renderForm();
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toBeEmptyDOMElement();
    fill();
    await submit();
    const heading = await screen.findByRole('heading', { name: "Thanks, we'll be in touch." });
    expect(heading).toHaveFocus();
    expect(screen.getByRole('status')).toBe(status);
    expect(status).toHaveTextContent('Your reference is a1b2c3d4e5f6');
    expect(screen.getByText('a1b2c3d4e5f6')).toBeInTheDocument();
    const payload = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);
    expect(payload).toEqual({ type: 'updates', website: '', name: 'José 李', email: 'visitor@example.com', phone: '', interest: 'Premium partner' });
  });

  it('returns to an empty form and focuses the first field after "Send another request"', async () => {
    renderForm();
    fill();
    await submit();
    await screen.findByRole('heading', { name: "Thanks, we'll be in touch." });
    fireEvent.click(screen.getByRole('button', { name: 'Send another request' }));
    const first = await screen.findByLabelText('Full name');
    await waitFor(() => expect(first).toHaveFocus());
    expect(first).toHaveValue('');
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('marks invalid fields and never sends, matching the submit.php minimums', async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText('Phone (optional)'), { target: { value: '12-34' } });
    await submit();
    const name = screen.getByLabelText('Full name');
    await waitFor(() => expect(name).toHaveAttribute('aria-invalid', 'true'));
    expect(name).toHaveAttribute('aria-describedby', `${name.id}-error`);
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByLabelText('Interest')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('Phone (optional)')).toHaveAttribute('aria-invalid', 'true');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('shows a definite 4xx message without the duplicate-submission warning', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(rejected(422, { success: false, message: 'Enter a valid email address.' }));
    renderForm();
    fill();
    await submit();
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Enter a valid email address.');
    expect(alert).not.toHaveTextContent(/may already have been saved/);
    expect(screen.getByLabelText('Full name')).toHaveValue('José 李');
    expect(screen.getByRole('button', { name: 'Send it' })).toBeEnabled();
  });

  it('tells the visitor how long to wait after a 429', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(rejected(429, { success: false, message: 'Too many requests.' }, '600'));
    renderForm();
    fill();
    await submit();
    expect(await screen.findByRole('alert')).toHaveTextContent('Please wait 10 minutes');
  });

  it('warns against blind retries when the outcome is uncertain', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 503, json: async () => ({}) });
    renderForm();
    fill();
    await submit();
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('It may already have been saved');
    expect(screen.getByRole('link', { name: 'Email the organizers' })).toHaveAttribute('href', 'mailto:organizers@cicainfo.com');
  });

  it('prefills a select from the query string by slug or value, ignoring unknown values', () => {
    window.history.replaceState(null, '', '/sponsors/?interest=matchday');
    const { unmount } = renderForm({ prefillParam: 'interest' });
    expect(screen.getByLabelText('Interest')).toHaveValue('Matchday supporter');
    unmount();
    window.history.replaceState(null, '', '/sponsors/?interest=%3Cscript%3E');
    renderForm({ prefillParam: 'interest' });
    expect(screen.getByLabelText('Interest')).toHaveValue('');
  });
});
