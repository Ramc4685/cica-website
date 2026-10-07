/** @jest-environment node */
declare const expect: jest.Expect;
declare const it: jest.It;
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

function handler(kind: string, lockAvailable = true, existingHeaders?: string[]) {
  const rows: unknown[][] = [];
  const repairs: [number, unknown][] = [];
  const releaseLock = jest.fn();
  const sheet = {
    appendRow: (row: unknown[]) => rows.push(row),
    getRange: (_row: number, column: number) => ({
      getValues: () => [existingHeaders || ['Timestamp', 'FirstName', 'LastName', 'Email', 'Phone', '', '']],
      setValue: (value: unknown) => repairs.push([column, value]),
    }),
  };
  const spreadsheet = { getSheetByName: () => existingHeaders ? sheet : null, insertSheet: () => sheet };
  const context = {
    SpreadsheetApp: { getActiveSpreadsheet: () => spreadsheet, openById: () => spreadsheet, flush: jest.fn() },
    LockService: { getScriptLock: () => ({ tryLock: () => lockAvailable, releaseLock }) },
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: (text: string) => ({ setMimeType: () => JSON.parse(text) }) },
  };
  const script = readFileSync(`scripts/apps-scripts/${kind}-form-script.gs`, 'utf8');
  const post = runInNewContext(script + '\ndoPost', context);
  return { post: (data: object) => post({ postData: { contents: JSON.stringify(data) } }), rows, repairs, releaseLock };
}
const samples = {
  contact: { firstName: 'José', lastName: '李', email: 'test@example.com', phone: '', subject: '=IMPORTXML("x")', message: 'A genuine family inquiry.' },
  join: { name: 'José 李', email: 'test@example.com', phone: '' },
  sponsor: { fullName: 'José 李', company: '=malicious', email: 'test@example.com', phone: '', interest: 'Community', message: 'A genuine sponsor inquiry.' },
};

describe('retained legacy Apps Script source safety', () => {
  for (const kind of Object.keys(samples) as (keyof typeof samples)[]) {
    it(`${kind}: validates, stores literal text and releases only an acquired lock`, () => {
      const result = handler(kind);
      expect(result.post(samples[kind]).success).toBe(true);
      expect(result.rows).toHaveLength(2);
      expect(result.rows[0].length).toBe(result.rows[1].length);
      expect(result.rows[1].some(value => typeof value === 'string' && value.startsWith('='))).toBe(false);
      expect(result.releaseLock).toHaveBeenCalledTimes(1);
    });
    it(`${kind}: refuses invalid input before storage`, () => {
      const result = handler(kind);
      expect(result.post({ ...samples[kind], email: 'invalid' }).success).toBe(false);
      expect(result.rows).toHaveLength(0);
      expect(result.releaseLock).not.toHaveBeenCalled();
    });
    it(`${kind}: handles lock contention without leaking internal errors`, () => {
      const result = handler(kind, false);
      expect(result.post(samples[kind])).toEqual({ success: false, message: 'The form is busy. Please contact the organizers.' });
      expect(result.rows).toHaveLength(0);
      expect(result.releaseLock).not.toHaveBeenCalled();
    });
  }
  it('repairs only empty contact headings without replacing rows or existing headings', () => {
    const result = handler('contact', true, ['Timestamp', 'FirstName', 'LastName', 'Email', 'Phone', '', '']);
    expect(result.post(samples.contact).success).toBe(true);
    expect(result.repairs).toEqual([[6, 'Subject'], [7, 'Message']]);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0][5]).toBe('\'=IMPORTXML("x")');
  });
});
