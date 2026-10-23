import { describe, it, expect } from 'vitest';
import { convertWallTimeToUtc, validateFutureSchedule, formatUtcToWallTime } from './timezone';

describe('Timezone Scheduler Engine', () => {
  describe('convertWallTimeToUtc', () => {
    it('should correctly convert Asia/Bangkok (UTC+7) time to UTC', () => {
      // 2026-10-24 09:00 in Bangkok -> 02:00 UTC on the same day
      const utc = convertWallTimeToUtc({
        date: '2026-10-24',
        time: '09:00',
        ianaTimezone: 'Asia/Bangkok',
      });

      expect(utc.toISOString()).toBe('2026-10-24T02:00:00.000Z');
    });

    it('should correctly convert America/New_York (EDT UTC-4 in October) time to UTC', () => {
      // 2026-10-24 09:00 in New York -> 13:00 UTC on the same day
      const utc = convertWallTimeToUtc({
        date: '2026-10-24',
        time: '09:00',
        ianaTimezone: 'America/New_York',
      });

      expect(utc.toISOString()).toBe('2026-10-24T13:00:00.000Z');
    });

    it('should reject invalid date or time strings', () => {
      expect(() =>
        convertWallTimeToUtc({
          date: 'invalid-date',
          time: '09:00',
          ianaTimezone: 'Asia/Bangkok',
        })
      ).toThrowError(/Invalid date format/);
    });
  });

  describe('validateFutureSchedule', () => {
    it('should reject dates set in the past', () => {
      const past = new Date(Date.now() - 1000 * 60 * 60); // 1 hour ago
      const result = validateFutureSchedule(past);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('must be at least');
    });

    it('should accept dates set in the future', () => {
      const future = new Date(Date.now() + 1000 * 60 * 60 * 24); // 1 day in future
      const result = validateFutureSchedule(future);
      expect(result.valid).toBe(true);
    });
  });

  describe('formatUtcToWallTime', () => {
    it('should format UTC timestamp back to target local time string', () => {
      const utc = new Date('2026-10-24T02:00:00.000Z');
      const formatted = formatUtcToWallTime(utc, 'Asia/Bangkok');

      expect(formatted.timeStr).toBe('09:00');
      expect(formatted.dateStr).toBe('2026-10-24');
    });
  });
});
