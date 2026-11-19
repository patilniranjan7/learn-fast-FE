import { describe, expect, it } from 'vitest';
import { localDate, monthDays, parseDate, shiftMonth, validateRevision } from './revisionDates.js';

describe('revision calendar dates', () => {
  it('lays out six complete Monday-first weeks across month boundaries', () => {
    const days = monthDays('2026-11-13');

    expect(days).toHaveLength(42);
    expect(days[0]).toBe('2026-10-26');
    expect(days.at(-1)).toBe('2026-12-06');
    expect(parseDate(days[0]).getDay()).toBe(1);
    expect(new Set(days).size).toBe(42);
  });

  it('preserves leap day and navigates months across the year boundary', () => {
    expect(monthDays('2028-02-01')).toContain('2028-02-29');
    expect(shiftMonth('2026-12-31', 1)).toBe('2027-01-01');
    expect(shiftMonth('2026-01-31', -1)).toBe('2025-12-01');
  });

  it('round-trips local calendar dates without shifting to another day', () => {
    expect(localDate(parseDate('2026-11-13'))).toBe('2026-11-13');
  });

  it('requires both a title and a revision date', () => {
    expect(validateRevision({ title: '   ', date: '' })).toEqual({
      title: 'Give your revision a title.',
      date: 'Choose a revision date.',
    });
    expect(validateRevision({ title: 'Forces practice', date: '2026-11-13' })).toEqual({});
  });
});
