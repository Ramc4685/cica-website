declare const expect: jest.Expect;
declare const it: jest.It;
import { submitForm, phoneField, nameField, UNCERTAIN_SUBMISSION } from '@/lib/form-submission';

describe('request submission boundary', () => {
  afterEach(() => jest.useRealTimers());
  it.each([
    { ok: false, json: async () => ({ success: true }) },
    { ok: true, json: async () => { throw new Error('invalid JSON'); } },
    { ok: true, json: async () => ({ success: false }) },
    { ok: true, json: async () => ({ success: 'true' }) },
    { ok: true, json: async () => null },
  ])('requires an HTTP success and explicit boolean success', async response => {
    global.fetch = jest.fn().mockResolvedValue(response);
    await expect(submitForm('contact', {})).rejects.toThrow(UNCERTAIN_SUBMISSION);
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
