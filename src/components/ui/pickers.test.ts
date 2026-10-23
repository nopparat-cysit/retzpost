import { describe, it, expect } from 'vitest';
import { formatDateDisplay } from './custom-date-picker';
import { parseTimeString, formatTimeOutput, BANGKOK_PEAK_SLOTS } from './custom-time-picker';

describe('CustomDatePicker Utility Functions', () => {
  it('formats YYYY-MM-DD correctly in Thai locale', () => {
    expect(formatDateDisplay('2026-10-24', 'th')).toBe('24 ต.ค. 2026');
    expect(formatDateDisplay('2026-01-01', 'th')).toBe('1 ม.ค. 2026');
    expect(formatDateDisplay('2026-12-31', 'th')).toBe('31 ธ.ค. 2026');
  });

  it('formats YYYY-MM-DD correctly in English locale', () => {
    expect(formatDateDisplay('2026-10-24', 'en')).toBe('Oct 24, 2026');
    expect(formatDateDisplay('2026-05-15', 'en')).toBe('May 15, 2026');
  });

  it('handles invalid or empty date gracefully', () => {
    expect(formatDateDisplay('', 'th')).toBe('');
    expect(formatDateDisplay('invalid-date', 'th')).toBe('invalid-date');
  });
});

describe('CustomTimePicker Utility Functions', () => {
  it('parses 12-hour AM/PM string correctly', () => {
    const morning = parseTimeString('08:30 AM');
    expect(morning.hour).toBe(8);
    expect(morning.minute).toBe(30);
    expect(morning.period).toBe('AM');

    const evening = parseTimeString('07:45 PM');
    expect(evening.hour).toBe(7);
    expect(evening.minute).toBe(45);
    expect(evening.period).toBe('PM');
  });

  it('parses 24-hour string correctly', () => {
    const lunch = parseTimeString('12:15');
    expect(lunch.hour).toBe(12);
    expect(lunch.minute).toBe(15);
    expect(lunch.period).toBe('PM');

    const prime = parseTimeString('19:30');
    expect(prime.hour).toBe(7);
    expect(prime.minute).toBe(30);
    expect(prime.period).toBe('PM');

    const midnight = parseTimeString('00:05');
    expect(midnight.hour).toBe(12);
    expect(midnight.minute).toBe(5);
    expect(midnight.period).toBe('AM');
  });

  it('formats output in 12-hour format with padding', () => {
    expect(formatTimeOutput(8, 5, 'AM', false)).toBe('08:05 AM');
    expect(formatTimeOutput(11, 30, 'AM', false)).toBe('11:30 AM');
    expect(formatTimeOutput(7, 45, 'PM', false)).toBe('07:45 PM');
  });

  it('formats output in 24-hour format correctly', () => {
    expect(formatTimeOutput(7, 30, 'PM', true)).toBe('19:30');
    expect(formatTimeOutput(9, 15, 'AM', true)).toBe('09:15');
    expect(formatTimeOutput(12, 0, 'PM', true)).toBe('12:00');
    expect(formatTimeOutput(12, 0, 'AM', true)).toBe('00:00');
  });

  it('contains valid Bangkok audience peak slots', () => {
    expect(BANGKOK_PEAK_SLOTS.length).toBeGreaterThanOrEqual(4);
    const morning = BANGKOK_PEAK_SLOTS.find(s => s.time === '08:30 AM');
    expect(morning).toBeDefined();
    expect(morning?.isPeak).toBe(true);

    const evening = BANGKOK_PEAK_SLOTS.find(s => s.time === '19:30 PM');
    expect(evening).toBeDefined();
    expect(evening?.isPeak).toBe(true);
  });
});
