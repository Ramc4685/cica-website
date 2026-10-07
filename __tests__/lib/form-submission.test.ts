declare const expect: jest.Expect;
declare const it: jest.It;
import { submitForm, phoneField, nameField, UNCERTAIN_SUBMISSION } from '@/lib/form-submission';

describe('request submission boundary', () => {
  afterEach(() => jest.useRealTimers());
  const headers = (values: Record<string, string> = {}) => ({ get: (name: string) => values[name] ?? null });
  it.each([
    { status: 503, ok: false, headers: headers(), json: async () => ({ success: false, message: 'busy' }) },
    { status: 200, ok: true, headers: headers(), json: async () => { throw new Error('invalid JSON'); } },
    { status: 200, ok: true, headers: headers(), json: async () => ({ success: false }) },
    { status: 200, ok: true, headers: headers(), json: async () => ({ success: 'true' }) },
    { status: 200, ok: true, headers: headers(), json: async () => null },
  ])('treats 5xx and malformed success bodies as uncertain', async response => {
    global.fetch = jest.fn().mockResolvedValue(response);
    await expect(submitForm('contact', {})).rejects.toMatchObject({ message: UNCERTAIN_SUBMISSION, uncertain: true });
  });
  it('treats network failures as uncertain', async () => {
    global.fetch = jest.fn().mockRejectedValue(new TypeError('network'));
    await expect(submitForm('contact', {})).rejects.toMatchObject({ message: UNCERTAIN_SUBMISSION, uncertain: true });
  });
  it('surfaces the server message for definite 4xx rejections', async () => {
    global.fetch = jest.fn().mockResolvedValue({ status: 422, ok: false, headers: headers(), json: async () => ({ success: false, message: 'Enter a valid email address.' }) });
    await expect(submitForm('contact', {})).rejects.toMatchObject({ message: 'Enter a valid email address.', uncertain: false });
  });
  it('uses a generic definite message when a 4xx body is not JSON', async () => {
    global.fetch = jest.fn().mockResolvedValue({ status: 403, ok: false, headers: headers(), json: async () => { throw new Error('html'); } });
    await expect(submitForm('contact', {})).rejects.toMatchObject({ uncertain: false });
  });
  it('reports the Retry-After wait for 429', async () => {
    global.fetch = jest.fn().mockResolvedValue({ status: 429, ok: false, headers: headers({ 'Retry-After': '600' }), json: async () => ({ success: false, message: 'Too many' }) });
    await expect(submitForm('contact', {})).rejects.toMatchObject({ message: expect.stringContaining('10 minutes'), uncertain: false, retryAfterSeconds: 600 });
  });
  it('returns the reference on success', async () => {
    global.fetch = jest.fn().mockResolvedValue({ status: 200, ok: true, headers: headers(), json: async () => ({ success: true, reference: 'abc123' }) });
    await expect(submitForm('contact', {})).resolves.toEqual({ reference: 'abc123' });
  });
  it('terminates a stalled request without encouraging an unsafe retry', async () => {
    jest.useFakeTimers();
    global.fetch = jest.fn().mockImplementation((_url, options) => new Promise((_resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(new Error('aborted')));
    }));
    const result = submitForm('contact', {});
    const assertion = expect(result).rejects.toThrow(UNCERTAIN_SUBMISSION);
    await jest.advanceTimersByTimeAsync(20000);
    await assertion;
    expect(jest.getTimerCount()).toBe(0);
  });
  it('validates optional phone numbers and sensible international names', () => {
    expect(phoneField.safeParse('').success).toBe(true);
    expect(phoneField.safeParse('(309) 555-0100').success).toBe(true);
    expect(phoneField.safeParse('+ ---').success).toBe(false);
    expect(nameField('Name').parse('  José 李  ')).toBe('José 李');
    expect(nameField('Name').safeParse('   ').success).toBe(false);
  });
});
